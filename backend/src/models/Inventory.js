import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  lastRestockedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

InventorySchema.index({ store: 1, product: 1 }, { unique: true });

export default mongoose.model("Inventory", InventorySchema);
