import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';

const router = Router();

// Seed admin
router.post('/seed-admin', async (req, res) => {
  const secret = req.query.secret as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@blinkit.com';
  if (secret && secret !== adminPassword) return res.status(403).json({ message: 'Forbidden' });

  try {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) return res.json({ message: 'Admin already exists', userId: existing._id });
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const user = new User({ name: 'Administrator', email: adminEmail, phone: '0000000000', passwordHash, roles: ['admin'] });
    await user.save();
    return res.json({ message: 'Admin created', userId: user._id });
  } catch (err) {
    console.error('Seed admin error', err);
    return res.status(500).json({ message: 'Failed to create admin' });
  }
});

// Seed all data
router.post('/seed', async (req, res) => {
  try {
    // Categories
    const categoryData = [
      { name: 'Vegetables & Fruits', slug: 'vegetables-fruits', icon: '🥬', color: '#E8F5E9', sortOrder: 1 },
      { name: 'Dairy & Breakfast', slug: 'dairy-breakfast', icon: '🥛', color: '#FFF3E0', sortOrder: 2 },
      { name: 'Munchies', slug: 'munchies', icon: '🍿', color: '#FCE4EC', sortOrder: 3 },
      { name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', icon: '🥤', color: '#E3F2FD', sortOrder: 4 },
      { name: 'Instant & Frozen Food', slug: 'instant-frozen-food', icon: '🍜', color: '#FFF8E1', sortOrder: 5 },
      { name: 'Tea, Coffee & Health Drinks', slug: 'tea-coffee-health', icon: '☕', color: '#EFEBE9', sortOrder: 6 },
      { name: 'Bakery & Biscuits', slug: 'bakery-biscuits', icon: '🍪', color: '#FBE9E7', sortOrder: 7 },
      { name: 'Atta, Rice & Dal', slug: 'atta-rice-dal', icon: '🌾', color: '#F3E5F5', sortOrder: 8 },
      { name: 'Sweet Tooth', slug: 'sweet-tooth', icon: '🍫', color: '#FCE4EC', sortOrder: 9 },
      { name: 'Baby Care', slug: 'baby-care', icon: '👶', color: '#E8EAF6', sortOrder: 10 },
      { name: 'Cleaning Essentials', slug: 'cleaning-essentials', icon: '🧹', color: '#E0F7FA', sortOrder: 11 },
      { name: 'Home & Office', slug: 'home-office', icon: '🏠', color: '#F1F8E9', sortOrder: 12 },
      { name: 'Personal Care', slug: 'personal-care', icon: '🧴', color: '#EDE7F6', sortOrder: 13 },
      { name: 'Pet Care', slug: 'pet-care', icon: '🐾', color: '#FFF3E0', sortOrder: 14 },
      { name: 'Pharma & Wellness', slug: 'pharma-wellness', icon: '💊', color: '#E8F5E9', sortOrder: 15 },
      { name: 'Electronics', slug: 'electronics', icon: '📱', color: '#E3F2FD', sortOrder: 16 },
    ];

    const categories: any = {};
    for (const c of categoryData) {
      const existing = await Category.findOne({ slug: c.slug });
      if (existing) {
        categories[c.slug] = existing;
      } else {
        const cat = new Category(c);
        await cat.save();
        categories[c.slug] = cat;
      }
    }

    // Products with real CDN image URLs
    const productData = [
      // Vegetables & Fruits
      { title: 'Fresh Tomato (Tamatar)', slug: 'fresh-tomato', category: 'vegetables-fruits', price: 32, mrp: 40, unit: '500 g', stock: 100, isFeatured: true, discount: 20, tags: ['vegetable', 'tomato', 'fresh'], rating: 4.2, ratingCount: 1240,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/a_cbb3c4a9-57a0-446d-be03-4a2780e0c80e.jpg' },
      { title: 'Onion', slug: 'onion', category: 'vegetables-fruits', price: 35, mrp: 42, unit: '1 kg', stock: 200, isFeatured: true, discount: 17, tags: ['vegetable', 'onion'], rating: 4.5, ratingCount: 3200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/1a7deef1-0468-4764-831e-e3a00b4036e5.jpg' },
      { title: 'Potato (Aloo)', slug: 'potato', category: 'vegetables-fruits', price: 29, mrp: 35, unit: '1 kg', stock: 150, discount: 17, tags: ['vegetable', 'potato', 'aloo'], rating: 4.3, ratingCount: 2100,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/de4e6c9b-8da2-4f19-9e14-57c1ac652498.jpg' },
      { title: 'Green Capsicum', slug: 'green-capsicum', category: 'vegetables-fruits', price: 22, mrp: 30, unit: '250 g', stock: 80, discount: 27, tags: ['vegetable', 'capsicum'], rating: 4.1, ratingCount: 890,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/fb476e1f-f559-49a0-bdae-265e79673c04.jpg' },
      { title: 'Fresh Banana', slug: 'fresh-banana', category: 'vegetables-fruits', price: 45, mrp: 55, unit: '6 pcs', stock: 120, isFeatured: true, discount: 18, tags: ['fruit', 'banana'], rating: 4.6, ratingCount: 5600,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/9a4c2c45-9565-444e-8b66-a7942953dece.jpg' },
      { title: 'Shimla Apple', slug: 'shimla-apple', category: 'vegetables-fruits', price: 120, mrp: 150, unit: '4 pcs', stock: 60, discount: 20, tags: ['fruit', 'apple', 'shimla'], rating: 4.4, ratingCount: 2300,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/0e388854-0226-422c-a2c8-7f0e48aeba2b.jpg' },
      { title: 'Cucumber (Kheera)', slug: 'cucumber', category: 'vegetables-fruits', price: 18, mrp: 25, unit: '500 g', stock: 90, discount: 28, tags: ['vegetable', 'cucumber'], rating: 4.0, ratingCount: 780,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/8c84929f-3776-499d-882a-ab5e44260fe9.jpg' },

      // Dairy & Breakfast
      { title: 'Amul Taaza Toned Milk', slug: 'amul-taaza-milk', category: 'dairy-breakfast', price: 27, mrp: 27, unit: '500 ml', stock: 200, isFeatured: true, discount: 0, tags: ['milk', 'amul', 'dairy'], rating: 4.7, ratingCount: 8900,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/a4a4a3a1-c6c0-4a50-b923-2ab0ebb8df5a.jpg' },
      { title: 'Amul Gold Full Cream Milk', slug: 'amul-gold-milk', category: 'dairy-breakfast', price: 36, mrp: 36, unit: '500 ml', stock: 180, discount: 0, tags: ['milk', 'amul', 'full cream'], rating: 4.8, ratingCount: 7200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/e3339e12-911b-4200-a39e-94da1c0bde33.jpg' },
      { title: 'Mother Dairy Classic Curd', slug: 'mother-dairy-curd', category: 'dairy-breakfast', price: 45, mrp: 50, unit: '400 g', stock: 100, discount: 10, tags: ['curd', 'dahi', 'dairy'], rating: 4.3, ratingCount: 3400,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/47e5dc77-3d46-4982-bc26-3b03a4554b2c.jpg' },
      { title: 'Amul Butter', slug: 'amul-butter', category: 'dairy-breakfast', price: 56, mrp: 60, unit: '100 g', stock: 80, isFeatured: true, discount: 7, tags: ['butter', 'amul', 'dairy'], rating: 4.9, ratingCount: 12000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/474a68c5-2405-4464-8018-2fa498d87e56.jpg' },
      { title: 'Britannia Brown Bread', slug: 'britannia-brown-bread', category: 'dairy-breakfast', price: 42, mrp: 45, unit: '400 g', stock: 70, discount: 7, tags: ['bread', 'brown bread', 'breakfast'], rating: 4.2, ratingCount: 2100,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/64b9d34f-6a09-439a-a0f8-9513ae7dbfcc.jpg' },
      { title: 'Kelloggs Corn Flakes', slug: 'kelloggs-cornflakes', category: 'dairy-breakfast', price: 165, mrp: 190, unit: '475 g', stock: 50, discount: 13, tags: ['cereal', 'cornflakes', 'breakfast'], rating: 4.4, ratingCount: 1800,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/64f26f10-a5ca-4c47-80b3-40c50d11a9c1.jpg' },

      // Munchies
      { title: 'Lays Classic Salted', slug: 'lays-classic', category: 'munchies', price: 20, mrp: 20, unit: '52 g', stock: 150, isFeatured: true, discount: 0, tags: ['chips', 'lays', 'snack'], rating: 4.5, ratingCount: 9800,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/33b83cdf-d95c-4e57-b053-a7cef96a4fad.jpg' },
      { title: 'Kurkure Masala Munch', slug: 'kurkure-masala', category: 'munchies', price: 20, mrp: 20, unit: '90 g', stock: 120, discount: 0, tags: ['kurkure', 'snack', 'masala'], rating: 4.4, ratingCount: 7600,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/8c24377e-bad4-4568-b20e-fd21886a758c.jpg' },
      { title: 'Haldirams Aloo Bhujia', slug: 'haldirams-bhujia', category: 'munchies', price: 48, mrp: 55, unit: '200 g', stock: 80, discount: 13, tags: ['bhujia', 'namkeen', 'haldirams'], rating: 4.6, ratingCount: 5400,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/ba7a39a3-a9fb-4e2d-b2b0-c1e1da9ad7c8.jpg' },
      { title: 'Act II Instant Popcorn', slug: 'act2-popcorn', category: 'munchies', price: 45, mrp: 50, unit: '70 g', stock: 60, discount: 10, tags: ['popcorn', 'snack', 'instant'], rating: 4.2, ratingCount: 3200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/fa45f8a6-ab35-4d98-8c79-c2ee29c4a2fc.jpg' },

      // Cold Drinks & Juices
      { title: 'Coca Cola', slug: 'coca-cola', category: 'cold-drinks-juices', price: 40, mrp: 40, unit: '750 ml', stock: 200, isFeatured: true, discount: 0, tags: ['coke', 'cola', 'soft drink'], rating: 4.6, ratingCount: 15000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/c57ca5c5-76dd-4c0a-8498-5f4c6d14c3ec.jpg' },
      { title: 'Real Mixed Fruit Juice', slug: 'real-mixed-fruit', category: 'cold-drinks-juices', price: 99, mrp: 110, unit: '1 L', stock: 80, discount: 10, tags: ['juice', 'real', 'fruit'], rating: 4.3, ratingCount: 4500,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/f79baa03-f616-4e80-9721-09c2b1f7c920.jpg' },
      { title: 'Paper Boat Aam Panna', slug: 'paper-boat-aam-panna', category: 'cold-drinks-juices', price: 30, mrp: 30, unit: '200 ml', stock: 100, discount: 0, tags: ['paper boat', 'aam panna', 'drink'], rating: 4.5, ratingCount: 6700,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/9a2d3bd7-a9c8-498a-b25f-49e2d4d6ea78.jpg' },
      { title: 'Bisleri Water', slug: 'bisleri-water', category: 'cold-drinks-juices', price: 20, mrp: 20, unit: '1 L', stock: 300, discount: 0, tags: ['water', 'bisleri', 'mineral'], rating: 4.1, ratingCount: 8900,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/25ddd9a4-74b8-4d39-8f0d-c3287e96db59.jpg' },

      // Instant & Frozen Food
      { title: 'Maggi 2-Minute Noodles', slug: 'maggi-noodles', category: 'instant-frozen-food', price: 14, mrp: 14, unit: '70 g', stock: 200, isFeatured: true, discount: 0, tags: ['maggi', 'noodles', 'instant'], rating: 4.8, ratingCount: 25000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/803aaa04-ca2c-47cc-b9e6-19003fdaf82c.jpg' },
      { title: 'McCain French Fries', slug: 'mccain-fries', category: 'instant-frozen-food', price: 135, mrp: 155, unit: '420 g', stock: 60, discount: 13, tags: ['fries', 'frozen', 'mccain'], rating: 4.5, ratingCount: 6700,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/b3e9c4d8-21e7-4eea-80c0-4ecbe59e5c0b.jpg' },
      { title: 'ITC Aashirvaad Atta Noodles', slug: 'aashirvaad-noodles', category: 'instant-frozen-food', price: 20, mrp: 22, unit: '280 g', stock: 80, discount: 9, tags: ['noodles', 'atta', 'instant'], rating: 4.0, ratingCount: 1200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/3984f037-0dae-4e3a-bd62-6e02fc78f0c0.jpg' },

      // Tea, Coffee & Health
      { title: 'Tata Tea Gold', slug: 'tata-tea-gold', category: 'tea-coffee-health', price: 215, mrp: 240, unit: '500 g', stock: 60, isFeatured: true, discount: 10, tags: ['tea', 'tata', 'gold'], rating: 4.6, ratingCount: 8900,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/a89cdd02-7046-4150-942e-5948b84b8ef1.jpg' },
      { title: 'Nescafe Classic Coffee', slug: 'nescafe-classic', category: 'tea-coffee-health', price: 175, mrp: 195, unit: '100 g', stock: 50, discount: 10, tags: ['coffee', 'nescafe', 'instant'], rating: 4.5, ratingCount: 7600,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/1aee9a2e-8db0-4b4c-a0c0-1d0d12e6f51b.jpg' },
      { title: 'Bournvita Health Drink', slug: 'bournvita', category: 'tea-coffee-health', price: 220, mrp: 260, unit: '500 g', stock: 70, discount: 15, tags: ['bournvita', 'health drink', 'chocolate'], rating: 4.4, ratingCount: 5400,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/2bb5d44f-b0c7-4a0a-9ba5-2e88ee9bd78e.jpg' },

      // Bakery & Biscuits
      { title: 'Parle-G Gold Biscuits', slug: 'parle-g-gold', category: 'bakery-biscuits', price: 30, mrp: 30, unit: '100 g', stock: 150, isFeatured: true, discount: 0, tags: ['biscuit', 'parle', 'glucose'], rating: 4.7, ratingCount: 18000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/77dd3e47-5dfe-4025-8618-93c2e4e6c2aa.jpg' },
      { title: 'Britannia Good Day Butter', slug: 'good-day-butter', category: 'bakery-biscuits', price: 35, mrp: 40, unit: '75 g', stock: 100, discount: 13, tags: ['biscuit', 'good day', 'butter'], rating: 4.5, ratingCount: 8900,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/f3c06c23-3f03-4c39-be08-d8aa9c0740d1.jpg' },
      { title: 'Oreo Vanilla Cream', slug: 'oreo-vanilla', category: 'bakery-biscuits', price: 30, mrp: 30, unit: '120 g', stock: 120, discount: 0, tags: ['biscuit', 'oreo', 'cream'], rating: 4.6, ratingCount: 12000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/4684d8cf-d496-4587-b5a0-1b4d19af4fba.jpg' },

      // Atta, Rice & Dal
      { title: 'Aashirvaad Atta', slug: 'aashirvaad-atta', category: 'atta-rice-dal', price: 255, mrp: 290, unit: '5 kg', stock: 40, isFeatured: true, discount: 12, tags: ['atta', 'wheat', 'aashirvaad'], rating: 4.6, ratingCount: 9800,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/2d12e96d-25bc-4f46-80cf-baf14f498ede.jpg' },
      { title: 'India Gate Basmati Rice', slug: 'india-gate-rice', category: 'atta-rice-dal', price: 399, mrp: 460, unit: '5 kg', stock: 30, discount: 13, tags: ['rice', 'basmati', 'india gate'], rating: 4.7, ratingCount: 7200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/8d8c3c4e-0f2e-4e56-bae5-4b4c8abdf10e.jpg' },
      { title: 'Toor Dal (Arhar)', slug: 'toor-dal', category: 'atta-rice-dal', price: 145, mrp: 165, unit: '1 kg', stock: 50, discount: 12, tags: ['dal', 'toor', 'arhar'], rating: 4.3, ratingCount: 3400,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/5e061a0d-3a3e-4dba-8e14-27e37ff394a4.jpg' },

      // Sweet Tooth
      { title: 'Cadbury Dairy Milk Silk', slug: 'dairy-milk-silk', category: 'sweet-tooth', price: 85, mrp: 85, unit: '60 g', stock: 80, isFeatured: true, discount: 0, tags: ['chocolate', 'cadbury', 'silk'], rating: 4.9, ratingCount: 22000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/92142f88-0b29-44a5-b1c7-46e7e1db07ce.jpg' },
      { title: 'Gulab Jamun (MTR)', slug: 'mtr-gulab-jamun', category: 'sweet-tooth', price: 120, mrp: 135, unit: '500 g', stock: 40, discount: 11, tags: ['sweet', 'gulab jamun', 'mtr'], rating: 4.4, ratingCount: 3200,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/d0c87c72-8a94-4fd3-bc3c-9c4f82f4b429.jpg' },
      { title: 'KitKat Wafer', slug: 'kitkat', category: 'sweet-tooth', price: 35, mrp: 40, unit: '37.3 g', stock: 100, discount: 13, tags: ['chocolate', 'kitkat', 'wafer'], rating: 4.7, ratingCount: 15000,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/7be7c9fe-9220-4e05-bd2c-27c0ae2c893c.jpg' },

      // Cleaning Essentials
      { title: 'Vim Dishwash Gel Lemon', slug: 'vim-dishwash', category: 'cleaning-essentials', price: 119, mrp: 135, unit: '500 ml', stock: 60, discount: 12, tags: ['dishwash', 'vim', 'cleaning'], rating: 4.3, ratingCount: 5600,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/39d15d6c-7d73-4e66-9f5a-6c3cf3f5b7f8.jpg' },
      { title: 'Harpic Toilet Cleaner', slug: 'harpic', category: 'cleaning-essentials', price: 78, mrp: 89, unit: '500 ml', stock: 50, discount: 12, tags: ['toilet', 'cleaner', 'harpic'], rating: 4.4, ratingCount: 4500,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/23b6aeac-5a21-406d-989b-07bd50c59bbd.jpg' },
      { title: 'Surf Excel Easy Wash', slug: 'surf-excel', category: 'cleaning-essentials', price: 165, mrp: 185, unit: '1 kg', stock: 45, isFeatured: true, discount: 11, tags: ['detergent', 'surf', 'washing'], rating: 4.5, ratingCount: 7800,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/79aa6f2a-02d3-45bf-b26f-fa2ada83f5ea.jpg' },

      // Personal Care
      { title: 'Colgate MaxFresh Toothpaste', slug: 'colgate-maxfresh', category: 'personal-care', price: 95, mrp: 110, unit: '150 g', stock: 80, discount: 14, tags: ['toothpaste', 'colgate', 'oral care'], rating: 4.4, ratingCount: 6700,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/5ece0b93-c27b-4e07-b898-3897c4d11f3b.jpg' },
      { title: 'Dove Shampoo', slug: 'dove-shampoo', category: 'personal-care', price: 215, mrp: 240, unit: '340 ml', stock: 50, discount: 10, tags: ['shampoo', 'dove', 'hair care'], rating: 4.5, ratingCount: 5400,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/c4c36ed2-db85-4cf5-bb17-0d31b0e75f0d.jpg' },
      { title: 'Dettol Handwash', slug: 'dettol-handwash', category: 'personal-care', price: 99, mrp: 115, unit: '200 ml', stock: 70, discount: 14, tags: ['handwash', 'dettol', 'hygiene'], rating: 4.6, ratingCount: 8900,
        imageUrl: 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_images/jpeg/04e3d75f-7e7e-40c8-aa04-c59e0d3c5e9e.jpg' },
    ];

    let created = 0;
    let updated = 0;
    for (const p of productData) {
      const existing = await Product.findOne({ slug: p.slug });
      if (existing) {
        // Update existing product with real image if it currently has a placeholder
        const currentImg = existing.images?.[0]?.url || '';
        if (currentImg.includes('placehold.co') || !currentImg || currentImg.includes('placeholder')) {
          existing.images = [{ url: p.imageUrl, publicId: '' }];
          await existing.save();
          updated++;
        }
        continue;
      }
      const cat = categories[p.category];
      const prod = new Product({
        title: p.title,
        slug: p.slug,
        category: cat?._id,
        price: p.price,
        mrp: p.mrp,
        unit: p.unit,
        stock: p.stock,
        isFeatured: p.isFeatured || false,
        discount: p.discount,
        tags: p.tags,
        rating: p.rating,
        ratingCount: p.ratingCount,
        images: [{ url: p.imageUrl, publicId: '' }],
        isAvailable: true
      });
      await prod.save();
      created++;
    }

    // Create demo user
    const demoUser = await User.findOne({ email: 'demo@blinkit.com' });
    if (!demoUser) {
      const passwordHash = await bcrypt.hash('demo123', 10);
      await new User({ name: 'Demo User', email: 'demo@blinkit.com', phone: '9876543210', passwordHash, roles: ['customer'], addresses: [{ label: 'Home', street: '123, MG Road, Sector 18', city: 'Gurugram', pincode: '122001' }] }).save();
    }

    res.json({
      message: 'Seed complete',
      categories: Object.keys(categories).length,
      productsCreated: created,
      productsUpdated: updated
    });
  } catch (err) {
    console.error('Seed error', err);
    res.status(500).json({ message: 'Seed failed', error: String(err) });
  }
});

export default router;
