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
      const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [{ title: new RegExp(safeQ, "i") }, { tags: new RegExp(safeQ, "i") }];
    }

    if (category) {
      if (typeof category !== "string") {
        return res.status(400).json({ message: "Invalid category parameter data type" });
      }
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

    let products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("storeId", "name code city area")
      .sort({ [sortField]: sortOrder, createdAt: -1 })
      .limit(limit);

    // Fuzzy typo-tolerance fallback if q returned 0 results
    if (products.length === 0 && q && q.length > 3) {
      const reducedQ = q.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fallbackFilter = { ...filter };
      fallbackFilter.$or = [{ title: new RegExp(reducedQ, "i") }, { tags: new RegExp(reducedQ, "i") }];
      products = await Product.find(fallbackFilter)
        .populate("category", "name slug")
        .populate("storeId", "name code city area")
        .sort({ [sortField]: sortOrder, createdAt: -1 })
        .limit(limit);
    }

    res.json(products);
  } catch (err) {
    console.error("Products query error:", err);
    res.status(500).json({ error: err.message, products: [] });
  }
});

// Buy Again smart recommendations
router.get("/buy-again", async (req, res) => {
  try {
    const popularStaples = await Product.find({ isAvailable: true })
      .populate("category", "name slug")
      .sort({ stock: -1, createdAt: -1 })
      .limit(10);
    res.json(popularStaples);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch buy-again products" });
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
  try {
    const { price, mrp } = req.body;
    if (mrp && Number(price) > Number(mrp)) {
      return res.status(400).json({ message: "Selling price cannot exceed Maximum Retail Price (MRP)" });
    }
    const p = new Product(req.body);
    await p.save();
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { price, mrp } = req.body;
    if (mrp && Number(price) > Number(mrp)) {
      return res.status(400).json({ message: "Selling price cannot exceed Maximum Retail Price (MRP)" });
    }
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
