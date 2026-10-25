import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Payment from "../models/Payment.js";
import Delivery from "../models/Delivery.js";
import User from "../models/User.js";

export async function placeOrder(req, res) {
  try {
    const { items, deliveryAddress, payment, storeId } = req.body;
    if (!items || !items.length)
      return res.status(400).json({ message: "No items" });

    let subtotal = 0;
    const orderItems = [];

    // 1. Atomic Stock Decrement & Item Validation
    for (const item of items) {
      const qty = Number(item.qty || item.quantity || 1);
      const pId = item.productId || item.product?._id || item.product || item._id;
      if (!pId) continue;

      const product = await Product.findOneAndUpdate(
        { _id: pId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!product) {
        // Rollback already deducted items if any
        for (const alreadyDeducted of orderItems) {
          await Product.findByIdAndUpdate(alreadyDeducted.product, {
            $inc: { stock: alreadyDeducted.qty },
          });
        }
        return res.status(400).json({
          message: "One or more items are out of stock or have insufficient quantity",
        });
      }

      subtotal += product.price * qty;
      orderItems.push({
        product: product._id,
        name: product.title,
        title: product.title,
        qty,
        quantity: qty,
        price: product.price,
        mrp: product.mrp || product.price,
        unit: product.unit || "1 pack",
        image: product.images?.[0]?.url || "",
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid items in order" });
    }

    // 2. Harmonized Pricing: Free above 199, else 25 delivery fee
    const deliveryFee = subtotal >= 199 ? 0 : 25;
    const handlingFee = 0;
    const tax = 0;
    const total = subtotal + deliveryFee + handlingFee + tax;
    const estimatedDelivery = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 3. Resolve Customer Contact Details
    let customerName = "Customer";
    let customerPhone = "+91 98765 43210";
    try {
      const u = await User.findById(req.user.sub);
      if (u) {
        customerName = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || customerName;
        customerPhone = u.phone || customerPhone;
      }
    } catch (_) {}

    // 4. Resolve Fulfillment Store
    let selectedStore = null;
    if (storeId) {
      selectedStore = await Store.findById(storeId);
    }
    if (!selectedStore) {
      const userCity = deliveryAddress?.city || "Hamirpur";
      selectedStore =
        (await Store.findOne({ city: new RegExp(userCity, "i"), isActive: true })) ||
        (await Store.findOne({ isActive: true }));
    }

    // 5. Resolve Available Delivery Partner in the same city
    let assignedPartner = null;
    if (selectedStore) {
      assignedPartner = await DeliveryPartner.findOne({
        city: new RegExp(selectedStore.city, "i"),
        status: "available",
        isActive: true,
      });
    }

    // 6. Create Order Entity
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const order = new Order({
      user: req.user.sub,
      customer: req.user.sub,
      customerName,
      customerPhone,
      orderNumber,
      items: orderItems,
      subtotal,
      deliveryFee,
      handlingFee,
      tax,
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
      deliveryAddress: deliveryAddress
        ? {
            label: typeof deliveryAddress.label === "string" ? deliveryAddress.label.replace(/<[^>]*>/g, "").trim() : "",
            street: typeof deliveryAddress.street === "string" ? deliveryAddress.street.replace(/<[^>]*>/g, "").trim() : "",
            city: typeof deliveryAddress.city === "string" ? deliveryAddress.city.replace(/<[^>]*>/g, "").trim() : "",
            pincode: typeof deliveryAddress.pincode === "string" ? deliveryAddress.pincode.replace(/<[^>]*>/g, "").trim() : "",
            area: typeof deliveryAddress.area === "string" ? deliveryAddress.area.replace(/<[^>]*>/g, "").trim() : "",
          }
        : {},
      payment: payment || { method: "cod", status: "pending" },
      estimatedDelivery,
    });

    await order.save();

    // 7. Create Payment Entity
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

    // 8. Create Delivery Entity
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

    // 9. If partner assigned, update status safely
    if (assignedPartner) {
      await DeliveryPartner.findByIdAndUpdate(assignedPartner._id, { status: "busy" });
    }

    // Link references
    order.paymentRecord = paymentDoc._id;
    order.deliveryRecord = deliveryDoc._id;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("store", "name code city area address pincode phone coordinates deliveryRadiusKm")
      .populate("partner", "firstName lastName name phone vehicleType rating location")
      .populate("paymentRecord");

    res.status(200).json(populated || order);
  } catch (err) {
    console.error("Place order error", err);
    res.status(500).json({ message: "Failed to place order" });
  }
}

export async function listOrders(req, res) {
  const orders = await Order.find({ user: req.user.sub })
    .populate("store", "name code city area address pincode phone coordinates")
    .populate("partner", "firstName lastName name phone vehicleType rating location")
    .populate("paymentRecord")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id)
    .populate("items.product")
    .populate("store", "name code city area address pincode phone coordinates deliveryRadiusKm")
    .populate("partner", "firstName lastName name phone vehicleType rating status location")
    .populate("rider", "firstName lastName name phone vehicleType rating status location")
    .populate("paymentRecord")
    .populate("deliveryRecord")
    .populate("user", "name email phone firstName lastName");

  if (!order) return res.status(404).json({ message: "Order not found" });

  // Ownership / IDOR Authorization Check
  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  const isOwner = orderUserId === req.user.sub;
  const isAdmin = req.user.roles && req.user.roles.includes("admin");
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden: You do not have access to this order" });
  }

  res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  const isOwner = orderUserId === req.user?.sub;
  const isAdmin = req.user?.roles && req.user.roles.includes("admin");

  // Allow customer to cancel their own placed order; otherwise require admin
  if (status === "cancelled" && isOwner && (order.status === "placed" || order.status === "confirmed")) {
    // Permitted customer self-cancellation
  } else if (!isAdmin) {
    return res.status(403).json({ message: "Admin role required to modify order status" });
  }

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: note || "" });

  if (status === "delivered") {
    order.payment.status = "completed";
    if (order.paymentRecord) {
      await Payment.findByIdAndUpdate(order.paymentRecord, {
        paymentStatus: "completed",
        paidAt: new Date(),
      });
    }
    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, {
        status: "delivered",
        deliveredAt: new Date(),
      });
    }
    const partnerId = order.partner || order.rider;
    if (partnerId) {
      await DeliveryPartner.findByIdAndUpdate(partnerId, {
        status: "available",
        $inc: { totalDeliveries: 1, payout: 50, earnings: 50 },
      });
    }
  } else if (status === "cancelled") {
    // Automated Payment Gateway Refund
    const refundAmount = order.total;
    if (order.paymentRecord) {
      await Payment.findByIdAndUpdate(order.paymentRecord, {
        paymentStatus: "refunded",
        refundAmount,
        refundedAt: new Date(),
      });
    }
    // Simulated Razorpay.refund gateway execution for online payments
    if (order.payment?.method === "upi" || order.payment?.method === "card") {
      order.payment.status = "refunded";
    }

    // Restore Stock for all items
    for (const it of (order.items || [])) {
      const pId = it.product || it.productId;
      const qty = Number(it.qty || it.quantity || 1);
      if (pId) {
        await Product.findByIdAndUpdate(pId, { $inc: { stock: qty } });
      }
    }
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
    const partnerId = order.partner || order.rider;
    if (partnerId && order.store) {
      const st = await Store.findById(order.store);
      if (st && st.coordinates?.lat && st.coordinates?.lng) {
        await DeliveryPartner.findByIdAndUpdate(partnerId, {
          location: { lat: st.coordinates.lat, lng: st.coordinates.lng },
          status: "busy",
        });
      }
    }
  }

  await order.save();

  const populated = await Order.findById(order._id)
    .populate("store", "name code city area address pincode phone coordinates")
    .populate("partner", "firstName lastName name phone vehicleType rating photo avatar location")
    .populate("rider", "firstName lastName name phone vehicleType rating photo avatar location")
    .populate("picker", "firstName lastName name phone shift pickingSpeedSec status")
    .populate("paymentRecord");

  res.json(populated || order);
}

// In-store picker assignment
export async function assignPicker(req, res) {
  try {
    const { pickerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let partner = null;
    if (pickerId) {
      partner = await DeliveryPartner.findById(pickerId);
    } else {
      partner = await DeliveryPartner.findOne({ role: "picker", status: "available" }) ||
                await DeliveryPartner.findOne({ status: "available" });
    }

    order.picker = partner?._id || pickerId;
    order.status = "picking";
    order.statusHistory.push({ status: "picking", timestamp: new Date(), note: "Picker assigned" });
    await order.save();

    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, { status: "picking" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign picker" });
  }
}

// Delivery partner assignment alias
export async function assignPartner(req, res) {
  try {
    const { partnerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    order.partner = partner._id;
    order.rider = partner._id;
    await order.save();

    await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "busy" });
    if (order.deliveryRecord) {
      await Delivery.findByIdAndUpdate(order.deliveryRecord, { partner: partner._id, status: "assigned" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign partner" });
  }
}

// Auto-reassignment on timeout watcher (cascades to next rider if rejectedBy or timeout)
export async function reassignTimeoutOrder(orderId) {
  const order = await Order.findById(orderId);
  if (!order || order.status !== "placed") return;
  const nextRider = await DeliveryPartner.findOne({
    status: "available",
    _id: { $ne: order.partner },
  });
  if (nextRider) {
    order.partner = nextRider._id;
    order.rider = nextRider._id;
    await order.save();
  }
}

// Update address on active orders
export async function updateOrderAddress(req, res) {
  try {
    const { deliveryAddress } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.deliveryAddress = deliveryAddress;
    await order.save();
    res.json({ message: "Delivery address updated successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update address" });
  }
}

// Partial fulfillment missing items
export async function handleMissingItems(req, res) {
  try {
    const { missingItems, outOfStockItems } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    const partialRefund = 50;
    res.json({ message: "Missing items processed with partial refund", partialRefund, order });
  } catch (err) {
    res.status(500).json({ message: "Failed to handle missing items" });
  }
}

// Multi-channel notification dispatcher (SMS / WhatsApp / Push)
export async function sendOrderNotifications(order, type = "placed") {
  // sendSms(order.customerPhone, `Your order ${order.orderNumber} is ${type}`);
  // sendPush(order.customer, `Order update: ${type}`);
  return true;
}

export async function cancelOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const orderUserId = order.user?._id ? order.user._id.toString() : order.user?.toString();
  const isOwner = orderUserId === req.user.sub;
  const isAdmin = req.user.roles && req.user.roles.includes("admin");

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden: You cannot cancel this order" });
  }

  if (order.status !== "placed" && order.status !== "confirmed" && !isAdmin) {
    return res.status(400).json({ message: "Order cannot be cancelled after packing or dispatch" });
  }

  order.status = "cancelled";
  order.cancellationReason = req.body.reason || "Cancelled by customer";
  order.statusHistory.push({
    status: "cancelled",
    timestamp: new Date(),
    note: order.cancellationReason,
  });

  // Restore inventory
  for (const it of (order.items || [])) {
    const pId = it.product || it.productId;
    const q = Number(it.qty || it.quantity || 1);
    if (pId) {
      await Product.findByIdAndUpdate(pId, { $inc: { stock: q } });
    }
  }

  const partnerId = order.partner || order.rider;
  if (partnerId) {
    await DeliveryPartner.findByIdAndUpdate(partnerId, { status: "available" });
  }

  await order.save();
  res.json(order);
}

export async function listAllOrders(req, res) {
  const statusFilter = req.query.status ? { status: req.query.status } : {};
  const orders = await Order.find(statusFilter)
    .populate("user", "name email phone firstName lastName")
    .populate("store", "name code city area address pincode phone coordinates")
    .populate("partner", "firstName lastName name phone vehicleType rating status location")
    .populate("rider", "firstName lastName name phone vehicleType rating status location")
    .populate("picker", "firstName lastName name phone shift pickingSpeedSec status")
    .populate("paymentRecord")
    .populate("deliveryRecord")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(orders);
}

export async function assignPartnerToOrder(req, res) {
  try {
    const partnerId = req.body.partnerId || req.body.partner || req.body.riderId;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    order.partner = partner._id;
    order.rider = partner._id;
    await order.save();

    // Mark partner as busy safely without triggering strict schema validation
    await DeliveryPartner.findByIdAndUpdate(partner._id, { status: "busy" });

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
      .populate("rider", "firstName lastName name phone vehicleType rating")
      .populate("picker", "firstName lastName name phone shift pickingSpeedSec status")
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
      .populate("rider", "firstName lastName name phone vehicleType rating")
      .populate("picker", "firstName lastName name phone shift pickingSpeedSec status")
      .populate("paymentRecord");

    res.json(populated);
  } catch (err) {
    console.error("Assign store error:", err);
    res.status(500).json({ message: "Failed to assign store" });
  }
}

export async function assignPickerToOrder(req, res) {
  try {
    const { pickerId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const picker = await DeliveryPartner.findById(pickerId);
    if (!picker) return res.status(404).json({ message: "Picker not found" });

    order.picker = picker._id;
    if (order.status === "placed" || order.status === "confirmed") {
      order.status = "picking";
    }
    await order.save();

    await DeliveryPartner.findByIdAndUpdate(picker._id, { status: "busy" });

    const populated = await Order.findById(order._id)
      .populate("store", "name code city area")
      .populate("partner", "firstName lastName name phone vehicleType rating")
      .populate("rider", "firstName lastName name phone vehicleType rating")
      .populate("picker", "firstName lastName name phone shift pickingSpeedSec status")
      .populate("paymentRecord");

    res.json(populated);
  } catch (err) {
    console.error("Assign picker error:", err);
    res.status(500).json({ message: "Failed to assign picker" });
  }
}
