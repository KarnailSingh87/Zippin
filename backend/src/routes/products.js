import { Router } from "express";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// list products with optional filters
router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const category = req.query.category;
  const featured = req.query.featured;
  const filter = { isAvailable: true };

  if (q) {
    filter.$or = [{ title: new RegExp(q, "i") }, { tags: new RegExp(q, "i") }];
  }
  if (category) filter.category = category;
  if (req.query.store) filter.storeId = req.query.store;
  if (featured === "true") filter.isFeatured = true;

  const limit = parseInt(req.query.limit) || 50;
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("storeId", "name code city area")
    .sort({ sortOrder: 1 })
    .limit(limit);
  res.json(products);
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
