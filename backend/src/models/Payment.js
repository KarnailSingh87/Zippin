import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card", "netbanking", "wallet"],
    default: "cod",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  transactionId: { type: String, default: "" },
  paidAt: { type: Date, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

// ER model aliases
PaymentSchema.virtual("payment_method").get(function () {
  return this.paymentMethod;
});
PaymentSchema.virtual("payment_status").get(function () {
  return this.paymentStatus;
});

PaymentSchema.set("toJSON", { virtuals: true });
PaymentSchema.set("toObject", { virtuals: true });

export default mongoose.model("Payment", PaymentSchema);
