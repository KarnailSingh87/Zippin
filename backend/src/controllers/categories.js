import Category from "../models/Category.js";

export async function listCategories(req, res) {
  const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json(cats);
}

export async function getCategory(req, res) {
  try {
    const rawSlug = req.params.slug ? req.params.slug.trim().toLowerCase() : "";

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
      vegetables: "vegetables-fruits",
      sweets: "sweet-tooth",
      cleaning: "cleaning-essentials",
      household: "cleaning-essentials",
      staples: "atta-rice-dal",
      office: "home-office",
    };

    const targetSlug = ALIASES[rawSlug] || rawSlug;

    // 1. Exact match
    let cat = await Category.findOne({ slug: targetSlug });

    // 2. Case-insensitive slug regex
    if (!cat) {
      cat = await Category.findOne({
        slug: new RegExp(`^${targetSlug}$`, "i"),
      });
    }

    // 3. Match by name
    if (!cat) {
      cat = await Category.findOne({
        name: new RegExp(`^${targetSlug.replace(/-/g, " ")}$`, "i"),
      });
    }

    // 4. Match partial slug/name
    if (!cat) {
      cat = await Category.findOne({
        $or: [
          { slug: new RegExp(targetSlug.replace(/-/g, ".*"), "i") },
          { name: new RegExp(targetSlug.replace(/-/g, ".*"), "i") },
        ],
      });
    }

    // 5. Try ObjectId
    if (!cat && /^[0-9a-fA-F]{24}$/.test(rawSlug)) {
      cat = await Category.findById(rawSlug);
    }

    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    console.error("getCategory error:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function createCategory(req, res) {
  const cat = new Category(req.body);
  await cat.save();
  res.json(cat);
}

export async function updateCategory(req, res) {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!cat) return res.status(404).json({ message: "Not found" });
  res.json(cat);
}

export async function deleteCategory(req, res) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
}
