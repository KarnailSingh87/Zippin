import { Router } from "express";
import Product from "../models/Product.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// list products with optional filters
router.get("/", async (req, res) => {
  try {
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

    if (category) {
      // Check if it's a valid ObjectId
      const isValidId = /^[0-9a-fA-F]{24}$/.test(category);
      if (isValidId) {
        filter.category = category;
      } else {
        // Look up category by slug or name
        const Category = (await import("../models/Category.js")).default;
        const ALIASES = {
          corner: "paan-corner",
          paan: "paan-corner",
          "paan-shop": "paan-corner",
          pharmacy: "pharma-wellness",
          wellness: "pharma-wellness",
          pharma: "pharma-wellness",
          pet: "pet-care",
          pets: "pet-care",
          baby: "baby-care",
          bakery: "bakery-biscuits",
          biscuits: "bakery-biscuits",
          drinks: "cold-drinks-juices",
          beverages: "cold-drinks-juices",
          grocery: "vegetables-fruits",
          fruits: "vegetables-fruits",
          veggies: "vegetables-fruits",
          sweets: "sweet-tooth",
          cleaning: "cleaning-essentials",
          household: "cleaning-essentials",
          staples: "atta-rice-dal",
          office: "home-office",
        };
        const targetSlug = ALIASES[category.toLowerCase()] || category.toLowerCase();
        const catDoc = await Category.findOne({
          $or: [
            { slug: targetSlug },
            { slug: new RegExp(`^${targetSlug}$`, "i") },
            { name: new RegExp(targetSlug.replace(/-/g, " "), "i") },
          ],
        });
        if (catDoc) {
          filter.category = catDoc._id;
        } else {
          filter.$or = [
            ...(filter.$or || []),
            { tags: new RegExp(category, "i") },
            { title: new RegExp(category, "i") },
          ];
        }
      }
    }

    if (req.query.store) filter.storeId = req.query.store;
    if (featured === "true") filter.isFeatured = true;

    const limit = parseInt(req.query.limit) || 1000;
    const sortField = req.query.sortBy || "sortOrder";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("storeId", "name code city area")
      .sort({ [sortField]: sortOrder, createdAt: -1 })
      .limit(limit);
    res.json(products);
  } catch (err) {
    console.error("Products query error:", err);
    res.status(500).json({ error: err.message, products: [] });
  }
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
