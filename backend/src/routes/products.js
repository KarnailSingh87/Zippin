import { Router } from "express";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// list products with optional filters
router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const category = req.query.category;
  const featured = req.query.featured;
  const filter = {};

  if (req.query.includeInactive !== "true" && req.query.all !== "true") {
    filter.isAvailable = true;
  }

  if (q) {
    filter.$or = [{ title: new RegExp(q, "i") }, { tags: new RegExp(q, "i") }];
  }
  if (category) filter.category = category;
  if (req.query.store) filter.storeId = req.query.store;
  if (featured === "true") filter.isFeatured = true;

  const limit = parseInt(req.query.limit) || 1000;
  const sortField = req.query.sortBy || "createdAt";
  const sortOrder = req.query.order === "asc" ? 1 : -1;

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("storeId", "name code city area")
    .sort({ [sortField]: sortOrder })
    .limit(limit);
  res.json(products);
});

// quick stats for admin
router.get("/stats/summary", authenticate, requireAdmin, async (req, res) => {
  const total = await Product.countDocuments();
  const active = await Product.countDocuments({ isAvailable: true });
  const inactive = await Product.countDocuments({ isAvailable: false });
  const featured = await Product.countDocuments({ isFeatured: true });
  const lowStock = await Product.countDocuments({ stock: { $lte: 10, $gt: 0 } });
  const outOfStock = await Product.countDocuments({ stock: 0 });
  res.json({ total, active, inactive, featured, lowStock, outOfStock });
});

// quick toggle availability
router.patch("/:id/toggle", authenticate, requireAdmin, async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  p.isAvailable = !p.isAvailable;
  await p.save();
  res.json(p);
});

// quick stock adjustment
router.patch("/:id/stock", authenticate, requireAdmin, async (req, res) => {
  const { stock } = req.body;
  const p = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: Number(stock) },
    { new: true }
  );
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});
// bulk operations
router.post("/bulk", authenticate, requireAdmin, async (req, res) => {
  const { action, ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  if (action === "activate") {
    await Product.updateMany({ _id: { $in: ids } }, { isAvailable: true });
    return res.json({ message: `Activated ${ids.length} products` });
  } else if (action === "deactivate") {
    await Product.updateMany({ _id: { $in: ids } }, { isAvailable: false });
    return res.json({ message: `Deactivated ${ids.length} products` });
  } else if (action === "delete") {
    await Product.deleteMany({ _id: { $in: ids } });
    return res.json({ message: `Deleted ${ids.length} products` });
  } else if (action === "feature") {
    await Product.updateMany({ _id: { $in: ids } }, { isFeatured: true });
    return res.json({ message: `Featured ${ids.length} products` });
  }
  res.status(400).json({ message: "Invalid action" });
});

// get by slug
router.get("/slug/:slug", async (req, res) => {
  const p = await Product.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .populate("storeId", "name code city area");
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// get by id
router.get("/:id", async (req, res) => {
  const p = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .populate("storeId", "name code city area");
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// admin CRUD
router.post("/", authenticate, requireAdmin, async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.json(p);
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
