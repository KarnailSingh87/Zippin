import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: "" },
  discountPercent: { type: Number, default: 0 },
  flatDiscount: { type: Number, default: 0 },
  minOrderValue: { type: Number, default: 149 },
  maxDiscount: { type: Number, default: 100 },
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Coupon", CouponSchema);
