import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
    default: null,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    default: null,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "pending_assignment",
      "assigned",
      "picking",
      "out_for_delivery",
      "delivered",
      "failed",
      "cancelled",
    ],
    default: "pending_assignment",
  },
  estimatedMinutes: { type: Number, default: 10 },
  assignedAt: { type: Date, default: null },
  pickedUpAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  deliveryNotes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Delivery", DeliverySchema);
