import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  slug: { type: String, index: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ url: String, publicId: String }],
  price: { type: Number, required: true },
  mrp: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  unit: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  tags: [String],
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ title: "text", tags: "text" });

export default mongoose.model("Product", ProductSchema);
