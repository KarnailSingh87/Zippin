import Category from "../models/Category.js";

export async function listCategories(req, res) {
  const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json(cats);
}

export async function getCategory(req, res) {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ message: "Category not found" });
  res.json(cat);
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
