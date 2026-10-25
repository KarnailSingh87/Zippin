import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  title: String,
  qty: Number,
  quantity: Number,
  price: Number,
  mrp: Number,
  total: Number,
  unit: String,
  image: String,
});

const StatusHistorySchema = new mongoose.Schema({
  status: String,
  timestamp: { type: Date, default: Date.now },
  note: String,
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerName: String,
  customerPhone: String,
  orderNumber: String,
  items: [ItemSchema],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  handlingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: {
    type: String,
    default: "placed",
    enum: [
      "placed",
      "confirmed",
      "picking",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
  },
  statusHistory: [StatusHistorySchema],
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  picker: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" }, // Assigned dark store picker/packer
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" },
  otp: { type: String, default: () => Math.floor(1000 + Math.random() * 9000).toString() },
  deliveryOtp: { type: String, default: "1234" },
  proofOfDelivery: String,
  rider: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPartner" }, // backwards-compatible alias
  paymentRecord: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  deliveryRecord: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
  deliveryAddress: {
    label: String,
    addressLine: String,
    street: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  deliveryOtp: { type: String, default: "1234" },
  podImageUrl: { type: String, default: "" },
  cancellationReason: { type: String, default: "" },
  payment: {
    method: { type: String, default: "cod" },
    status: { type: String, default: "pending" },
    transactionId: String,
  },
  couponCode: String,
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
});

OrderSchema.virtual("paymentMethod").get(function () {
  return this.payment?.method || "cod";
});

// ER Model virtual aliases
OrderSchema.virtual("order_id").get(function () {
  return this._id;
});
OrderSchema.virtual("customer_id").get(function () {
  return this.user;
});
OrderSchema.virtual("store_id").get(function () {
  return this.store;
});
OrderSchema.virtual("partner_id").get(function () {
  return this.partner || this.rider;
});
OrderSchema.virtual("order_datetime").get(function () {
  return this.createdAt;
});
OrderSchema.virtual("total_amount").get(function () {
  return this.total;
});

OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

export default mongoose.model("Order", OrderSchema);
