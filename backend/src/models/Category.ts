import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#f0f0f0' },
  sortOrder: { type: Number, default: 0 },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Category', CategorySchema);
