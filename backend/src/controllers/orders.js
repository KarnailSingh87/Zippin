import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Payment from "../models/Payment.js";
import Delivery from "../models/Delivery.js";

export async function placeOrder(req, res) {
  try {
    const { items, deliveryAddress, payment, storeId } = req.body;
    if (!items || !items.length)
      return res.status(400).json({ message: "No items" });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const qty = item.qty || 1;
      subtotal += product.price * qty;
      orderItems.push({
        product: product._id,
        name: product.title,
        qty,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit,
        image: product.images?.[0]?.url || "",
      });
    }

    const deliveryFee = subtotal >= 499 ? 0 : 30;
    const total = subtotal + deliveryFee;
    const estimatedDelivery = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 1. Resolve Fulfillment Store
    let selectedStore = null;
    if (storeId) {
      selectedStore = await Store.findById(storeId);
    }
    if (!selectedStore) {
      // Find active store matching city or default to first active store
      const userCity = deliveryAddress?.city || "Gurugram";
      selectedStore =
        (await Store.findOne({ city: new RegExp(userCity, "i"), isActive: true })) ||
        (await Store.findOne({ isActive: true }));
    }

    // 2. Resolve Available Delivery Partner in the same city
    let assignedPartner = null;
    if (selectedStore) {
      assignedPartner = await DeliveryPartner.findOne({
        city: new RegExp(selectedStore.city, "i"),
        status: "available",
        isActive: true,
      });
    }

    // 3. Create Order
    const order = new Order({
      user: req.user.sub,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: "placed",
      statusHistory: [
        {
          status: "placed",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
      store: selectedStore?._id || null,
      partner: assignedPartner?._id || null,
      rider: assignedPartner?._id || null,
      deliveryAddress: deliveryAddress || {},
      payment: payment || { method: "cod", status: "pending" },
      estimatedDelivery,
    });

    await order.save();

    // 4. Create Payment Entity
    const paymentMethod = payment?.method || "cod";
    const paymentStatus =
      payment?.status || (paymentMethod === "cod" ? "pending" : "completed");

    const paymentDoc = new Payment({
      order: order._id,
      customer: req.user.sub,
      amount: total,
      paymentMethod,
      paymentStatus,
      transactionId:
        payment?.transactionId ||
        `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      paidAt: paymentStatus === "completed" ? new Date() : null,
    });
    await paymentDoc.save();

    // 5. Create Delivery Entity
    const deliveryDoc = new Delivery({
      order: order._id,
      store: selectedStore?._id || null,
      partner: assignedPartner?._id || null,
      customer: req.user.sub,
      status: assignedPartner ? "assigned" : "pending_assignment",
      assignedAt: assignedPartner ? new Date() : null,
      estimatedMinutes: 10,
    });
    await deliveryDoc.save();

    // 6. If partner assigned, update their status to busy
    if (assignedPartner) {
      assignedPartner.status = "busy";
      await assignedPartner.save();
    }

    // Link references on order
    order.paymentRecord = paymentDoc._id;
    order.deliveryRecord = deliveryDoc._id;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("store", "name code city area phone")
      .populate("partner", "firstName lastName name phone vehicleType rating")
      .populate("paymentRecord");

    res.json(populated || order);
  } catch (err) {
    console.error("Place order error", err);
    res.status(500).json({ message: "Failed to place order" });
  }
}

export async function listOrders(req, res) {
  const orders = await Order.find({ user: req.user.sub })
    .populate("store", "name code city area")
    .populate("partner", "firstName lastName name phone vehicleType rating")
    .populate("paymentRecord")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("store", "name code city area phone")
    .populate("partner", "firstName lastName name phone vehicleType rating status")
    .populate("paymentRecord")
    .populate("deliveryRecord")
    .populate("user", "name email phone firstName lastName");

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: note || "" });

  if (status === "delivered") {
    order.payment.status = "completed";
    // Sync payment entity
    if (order.paymentRecord) {
      await Payment.findByIdAndUpdate(order.paymentRecord, {
        paymentStatus: "completed",
        paidAt: new Date(),
      });
    }
    // Sync delivery entity
    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, {
        status: "delivered",
        deliveredAt: new Date(),
      });
    }
    // Free the partner
    const partnerId = order.partner || order.rider;
    if (partnerId) {
      await DeliveryPartner.findByIdAndUpdate(partnerId, {
        status: "available",
        $inc: { totalDeliveries: 1 },
      });
    }
  } else if (status === "cancelled") {
    const partnerId = order.partner || order.rider;
    if (partnerId) {
      await DeliveryPartner.findByIdAndUpdate(partnerId, { status: "available" });
    }
    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, {
        status: "cancelled",
      });
    }
  } else if (status === "out_for_delivery") {
    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, {
        status: "out_for_delivery",
        pickedUpAt: new Date(),
      });
    }
  }

  await order.save();

  const populated = await Order.findById(order._id)
    .populate("store", "name code city area")
    .populate("partner", "firstName lastName name phone vehicleType rating")
    .populate("paymentRecord");

  res.json(populated || order);
}

export async function listAllOrders(req, res) {
  const statusFilter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(statusFilter)
    .populate("user", "name email phone firstName lastName")
    .populate("store", "name code city area")
    .populate("partner", "firstName lastName name phone vehicleType rating status")
    .populate("paymentRecord")
    .populate("deliveryRecord")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(orders);
}

export async function assignPartnerToOrder(req, res) {
  try {
    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    order.partner = partner._id;
    order.rider = partner._id;
    await order.save();

    // Mark partner as busy
    partner.status = "busy";
    await partner.save();

    // Sync delivery record
    await Delivery.findOneAndUpdate(
      { order: order._id },
      {
        partner: partner._id,
        status: "assigned",
        assignedAt: new Date(),
      },
      { upsert: true }
    );

    const populated = await Order.findById(order._id)
      .populate("store", "name code city area")
      .populate("partner", "firstName lastName name phone vehicleType rating")
      .populate("paymentRecord");

    res.json(populated);
  } catch (err) {
    console.error("Assign partner error:", err);
    res.status(500).json({ message: "Failed to assign partner" });
  }
}

export async function assignStoreToOrder(req, res) {
  try {
    const { storeId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    order.store = store._id;
    await order.save();

    await Delivery.findOneAndUpdate({ order: order._id }, { store: store._id });

    const populated = await Order.findById(order._id)
      .populate("store", "name code city area")
      .populate("partner", "firstName lastName name phone vehicleType rating")
      .populate("paymentRecord");

    res.json(populated);
  } catch (err) {
    console.error("Assign store error:", err);
    res.status(500).json({ message: "Failed to assign store" });
  }
}
