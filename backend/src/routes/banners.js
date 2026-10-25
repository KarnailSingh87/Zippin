import { Router } from "express";
import Banner from "../models/Banner.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

const DEFAULT_BANNERS = [
  {
    title: "Paan Corner & Refreshments",
    subtitle: "Quick refreshment delivered in 8-10 minutes",
    badge: "Fastest Delivery",
    image: "/images/banner-paan.webp",
    fallback: "/images/banner-hero.jpg",
    link: "/category/paan-corner",
    categorySlug: "paan-corner",
    type: "hero",
    order: 1,
    isActive: true,
  },
  {
    title: "Pharmacy & Wellness",
    subtitle: "Over-the-counter medicines & health care essentials",
    badge: "Pharmacy in 10 mins",
    image: "/images/pharmacy-promo.avif",
    fallback: "/images/banner-hero.jpg",
    link: "/category/pharma-wellness",
    categorySlug: "pharma-wellness",
    type: "promo_tile",
    order: 1,
    isActive: true,
  },
  {
    title: "Pet Care Store",
    subtitle: "Dog food, treats, toys & grooming essentials",
    badge: "Pet Care Express",
    image: "/images/petcare-promo.avif",
    fallback: "/images/banner-hero.jpg",
    link: "/category/pet-care",
    categorySlug: "pet-care",
    type: "promo_tile",
    order: 2,
    isActive: true,
  },
  {
    title: "Baby Care Essentials",
    subtitle: "Diapers, wipes, baby foods & gentle skincare",
    badge: "Baby Care",
    image: "/images/babycare-promo.avif",
    fallback: "/images/banner-hero.jpg",
    link: "/category/baby-care",
    categorySlug: "baby-care",
    type: "promo_tile",
    order: 3,
    isActive: true,
  },
];

// Helper to auto-seed initial banners if empty
async function ensureDefaultBanners() {
  try {
    const count = await Banner.countDocuments();
    if (count === 0) {
      await Banner.insertMany(DEFAULT_BANNERS);
    }
  } catch (err) {
    console.error("Error ensuring default banners:", err);
  }
}

// GET /api/banners (public/storefront and admin)
router.get("/", async (req, res) => {
  try {
    await ensureDefaultBanners();
    const { type, activeOnly } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (activeOnly === "true") filter.isActive = true;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch banners", details: err.message });
  }
});

// POST /api/banners (Admin create)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(400).json({ error: "Failed to create banner", details: err.message });
  }
});

// PATCH /api/banners/:id (Admin update)
router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.json(banner);
  } catch (err) {
    res.status(400).json({ error: "Failed to update banner", details: err.message });
  }
});

// DELETE /api/banners/:id (Admin delete)
router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner not found" });
    res.json({ message: "Banner deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete banner", details: err.message });
  }
});

export default router;
