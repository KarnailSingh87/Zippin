import Delivery from "../models/Delivery.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";

// List deliveries
export async function listDeliveries(req, res) {
  try {
    const { status, partnerId, storeId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (partnerId) filter.partner = partnerId;
    if (storeId) filter.store = storeId;

    const deliveries = await Delivery.find(filter)
      .populate("order", "total status deliveryAddress createdAt")
      .populate("partner", "firstName lastName name phone status vehicleType rating")
      .populate("store", "name code city area")
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 });

    res.json(deliveries);
  } catch (err) {
    console.error("List deliveries error:", err);
    res.status(500).json({ message: "Failed to list deliveries" });
  }
}

// Get delivery for an order
export async function getDeliveryByOrder(req, res) {
  try {
    const delivery = await Delivery.findOne({ order: req.params.orderId })
      .populate("order")
      .populate("partner", "firstName lastName name phone status vehicleType rating photo avatar")
      .populate("store", "name code city area phone")
      .populate("customer", "name phone email");

    if (!delivery) return res.status(404).json({ message: "Delivery record not found" });

    const isAdmin = req.user?.roles?.includes("admin") || req.user?.role === "admin";
    const deliveryCustId = (delivery.customer?._id || delivery.customer)?.toString();
    const isOwner = deliveryCustId === req.user?.sub?.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: Access denied to other customer deliveries" });
    }

    res.json(delivery);
  } catch (err) {
    console.error("Get delivery error:", err);
    res.status(500).json({ message: "Failed to get delivery" });
  }
}

// Assign delivery partner to order
export async function assignDeliveryPartner(req, res) {
  try {
    const { orderId, partnerId } = req.body;
    if (!orderId || !partnerId) {
      return res.status(400).json({ message: "orderId and partnerId are required" });
    }

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    let delivery = await Delivery.findOne({ order: orderId });
    if (!delivery) {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: "Order not found" });
      delivery = new Delivery({
        order: order._id,
        customer: order.user,
        store: order.store,
      });
    }

    delivery.partner = partner._id;
    delivery.status = "assigned";
    delivery.assignedAt = new Date();
    await delivery.save();

    // Update partner status to busy
    partner.status = "busy";
    await partner.save();

    // Update order partner & rider
    await Order.findByIdAndUpdate(orderId, {
      partner: partner._id,
      rider: partner._id,
      deliveryRecord: delivery._id,
    });

    const populated = await Delivery.findById(delivery._id)
      .populate("partner", "firstName lastName name phone status")
      .populate("order");

    res.json(populated);
  } catch (err) {
    console.error("Assign partner error:", err);
    res.status(500).json({ message: "Failed to assign partner" });
  }
}

// Update delivery status
export async function updateDeliveryStatus(req, res) {
  try {
    const { status, notes, otp, proofPhoto, podUrl } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    // Enforce role authorization: only Admin or assigned Partner can update delivery
    const isAdmin = req.user?.roles?.includes("admin") || req.user?.role === "admin";
    const isPartner =
      req.user?.roles?.includes("partner") ||
      req.user?.roles?.includes("rider") ||
      delivery.partner?.toString() === req.user?.sub?.toString();

    if (!isAdmin && !isPartner) {
      return res.status(403).json({
        message: "Forbidden: Only store managers or delivery partners can change delivery status",
      });
    }

    if (otp) delivery.otp = otp;
    if (proofPhoto || podUrl) {
      delivery.proofPhoto = proofPhoto || podUrl;
      delivery.podUrl = proofPhoto || podUrl;
    }

    delivery.status = status;
    if (notes) delivery.deliveryNotes = notes;

    if (status === "picking" || status === "out_for_delivery") {
      delivery.pickedUpAt = delivery.pickedUpAt || new Date();
    } else if (status === "delivered") {
      delivery.deliveredAt = new Date();
      // Free the partner and credit payout
      if (delivery.partner) {
        await DeliveryPartner.findByIdAndUpdate(delivery.partner, {
          status: "available",
          $inc: {
            totalDeliveries: 1,
            payout: 50, // Per-delivery payout
            earnings: 50,
            walletBalance: 50,
          },
        });
      }
    }

    await delivery.save();

    // Sync order status
    if (delivery.order && ["out_for_delivery", "delivered"].includes(status)) {
      await Order.findByIdAndUpdate(delivery.order, { status });
    }

    res.json(delivery);
  } catch (err) {
    console.error("Update delivery status error:", err);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
}

// Emergency vehicle breakdown & auto-reassignment
export async function reassignOnBreakdown(req, res) {
  try {
    const { reason } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });

    // Mark current partner offline due to breakdown
    if (delivery.partner) {
      await DeliveryPartner.findByIdAndUpdate(delivery.partner, {
        status: "offline",
        breakdownNotes: reason || "Vehicle breakdown reported mid-transit",
      });
    }

    // Find substitute partner
    const substitute = await DeliveryPartner.findOne({
      city: delivery.store ? (await Order.findById(delivery.order))?.deliveryAddress?.city || "Gurugram" : "Gurugram",
      status: "available",
      isActive: true,
      _id: { $ne: delivery.partner },
    });

    if (substitute) {
      delivery.partner = substitute._id;
      delivery.status = "assigned";
      await delivery.save();
      await DeliveryPartner.findByIdAndUpdate(substitute._id, { status: "busy" });
      await Order.findByIdAndUpdate(delivery.order, { partner: substitute._id, rider: substitute._id });
    } else {
      delivery.partner = null;
      delivery.status = "pending_assignment";
      await delivery.save();
    }

    res.json({ message: "Order successfully reassigned following breakdown", delivery });
  } catch (err) {
    console.error("Breakdown reassign error:", err);
    res.status(500).json({ message: "Reassignment failed" });
  }
}
