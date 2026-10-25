import mongoose from "mongoose";

const DeliveryPartnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true, default: "" },
  name: { type: String, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, default: "" },
  city: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["available", "busy", "offline"],
    default: "available",
  },
  vehicleType: {
    type: String,
    enum: ["Bike", "EV Scooter", "Bicycle", "Van"],
    default: "Bike",
  },
  vehicleNumber: { type: String, default: "" },
  rating: { type: Number, default: 4.8 },
  totalDeliveries: { type: Number, default: 0 },
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
