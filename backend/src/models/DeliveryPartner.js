import mongoose from "mongoose";

const DeliveryPartnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true, default: "" },
  name: { type: String, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, default: "" },
  city: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["rider", "picker"],
    default: "rider",
  },
  status: {
    type: String,
    enum: ["available", "busy", "offline", "break", "on_break"],
    default: "available",
  },
  vehicleType: {
    type: String,
    default: "Bike",
  },
  vehicleNumber: { type: String, default: "" },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
  },
  isApproved: { type: Boolean, default: true },
  documents: {
    drivingLicense: { type: String, default: "" },
    aadhar: { type: String, default: "" },
    aadhaar: { type: String, default: "" },
    license: { type: String, default: "" },
  },
  photo: { type: String, default: "" },
  avatar: { type: String, default: "" },
  photoUrl: { type: String, default: "" },
  walletBalance: { type: Number, default: 0 },
  payout: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  cashInHand: { type: Number, default: 0 },
  codBalance: { type: Number, default: 0 },
  location: {
    lat: { type: Number, default: 28.4595 },
    lng: { type: Number, default: 77.0266 },
  },
  rating: { type: Number, default: 4.8 },
  totalDeliveries: { type: Number, default: 0 },
  pickingSpeedSec: { type: Number, default: 95 },
  totalOrdersPacked: { type: Number, default: 0 },
  shift: {
    type: String,
    enum: ["Morning", "Evening", "Night"],
    default: "Morning",
  },
  currentStore: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Sync name with firstName + lastName
DeliveryPartnerSchema.pre("save", function (next) {
  if (this.firstName) {
    this.name = this.lastName
      ? `${this.firstName} ${this.lastName}`.trim()
      : this.firstName.trim();
  }
  next();
});

// ER model alias
DeliveryPartnerSchema.virtual("first_name").get(function () {
  return this.firstName;
});

DeliveryPartnerSchema.set("toJSON", { virtuals: true });
DeliveryPartnerSchema.set("toObject", { virtuals: true });

export default mongoose.model("DeliveryPartner", DeliveryPartnerSchema);
