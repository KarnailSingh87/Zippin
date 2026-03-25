import { Request, Response } from 'express';
import Category from '../models/Category';

export async function listCategories(req: Request, res: Response) {
  const cats = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  res.json(cats);
}

export async function getCategory(req: Request, res: Response) {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json(cat);
}

export async function createCategory(req: Request, res: Response) {
  const cat = new Category(req.body);
  await cat.save();
  res.json(cat);
}

export async function updateCategory(req: Request, res: Response) {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
}

export async function deleteCategory(req: Request, res: Response) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}
