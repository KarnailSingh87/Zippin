import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// List payments with filters
export async function listPayments(req, res) {
  try {
    const { status, method, limit } = req.query;
    const filter = {};
    if (status) filter.paymentStatus = status;
    if (method) filter.paymentMethod = method;

    const payments = await Payment.find(filter)
      .populate("customer", "name email phone firstName lastName")
      .populate("order", "total status items createdAt")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 100);

    res.json(payments);
  } catch (err) {
    console.error("List payments error:", err);
    res.status(500).json({ message: "Failed to list payments" });
  }
}

// Get single payment
export async function getPayment(req, res) {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("customer", "name email phone firstName lastName")
      .populate("order");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const isAdmin = req.user?.roles?.includes("admin") || req.user?.role === "admin";
    const paymentCustId = (payment.customer?._id || payment.customer)?.toString();
    const isOwner = paymentCustId === req.user?.sub?.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: Access denied to other customer payments" });
    }

    res.json(payment);
  } catch (err) {
    console.error("Get payment error:", err);
    res.status(500).json({ message: "Failed to get payment" });
  }
}

// Get payment by Order ID
export async function getPaymentByOrder(req, res) {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId })
      .populate("customer", "name email phone");
    if (!payment) return res.status(404).json({ message: "Payment not found for this order" });

    const isAdmin = req.user?.roles?.includes("admin") || req.user?.role === "admin";
    const paymentCustId = (payment.customer?._id || payment.customer)?.toString();
    const isOwner = paymentCustId === req.user?.sub?.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Forbidden: Access denied to other customer payments" });
    }

    res.json(payment);
  } catch (err) {
    console.error("Get order payment error:", err);
    res.status(500).json({ message: "Failed to get payment" });
  }
}

// Update payment status (Admin)
export async function updatePaymentStatus(req, res) {
  try {
    const { paymentStatus, transactionId } = req.body;
    const update = {};
    if (paymentStatus) {
      update.paymentStatus = paymentStatus;
      if (paymentStatus === "completed") {
        update.paidAt = new Date();
      }
    }
    if (transactionId) update.transactionId = transactionId;

    const payment = await Payment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Sync with order if completed
    if (payment.order && paymentStatus) {
      await Order.findByIdAndUpdate(payment.order, {
        "payment.status": paymentStatus,
      });
    }

    res.json(payment);
  } catch (err) {
    console.error("Update payment error:", err);
    res.status(500).json({ message: "Failed to update payment" });
  }
}
