import mongoose from "mongoose";
import https from "https";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blinkit";

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for Blinkit seeding...");
  const db = mongoose.connection.db;

  const CATEGORIES = [
    {
      name: "Vegetables & Fruits",
      slug: "vegetables-fruits",
      image: "/images/layout-category-1.png",
      icon: "🥬",
      color: "#E8F5E9",
      sortOrder: 1,
    },
    {
      name: "Dairy, Bread & Eggs",
      slug: "dairy-breakfast",
      image: "/images/layout-category-2.png",
      icon: "🥛",
      color: "#FFF3E0",
      sortOrder: 2,
    },
    {
      name: "Munchies & Chips",
      slug: "munchies",
      image: "/images/layout-category-3.png",
      icon: "🍿",
      color: "#FCE4EC",
      sortOrder: 3,
    },
    {
      name: "Cold Drinks & Juices",
      slug: "cold-drinks-juices",
      image: "/images/layout-category-4.png",
      icon: "🥤",
      color: "#E3F2FD",
      sortOrder: 4,
    },
    {
      name: "Instant & Frozen Food",
      slug: "instant-frozen-food",
      image: "/images/layout-category-5.png",
      icon: "🍜",
      color: "#FFF8E1",
      sortOrder: 5,
    },
    {
      name: "Tea, Coffee & Health Drinks",
      slug: "tea-coffee-health",
      image: "/images/layout-category-6.png",
      icon: "☕",
      color: "#EFEBE9",
      sortOrder: 6,
    },
    {
      name: "Bakery & Biscuits",
      slug: "bakery-biscuits",
      image: "/images/layout-category-7.png",
      icon: "🍪",
      color: "#FBE9E7",
      sortOrder: 7,
    },
    {
      name: "Sweet Tooth & Ice Cream",
      slug: "sweet-tooth",
      image: "/images/layout-category-8.png",
      icon: "🍫",
      color: "#FCE4EC",
      sortOrder: 8,
    },
    {
      name: "Atta, Rice & Dal",
      slug: "atta-rice-dal",
      image: "/images/layout-category-9.png",
      icon: "🌾",
      color: "#F3E5F5",
      sortOrder: 9,
    },
    {
      name: "Cleaning Essentials",
      slug: "cleaning-essentials",
      image: "/images/layout-category-10.png",
      icon: "🧹",
      color: "#E0F7FA",
      sortOrder: 10,
    },
    {
      name: "Home & Office",
      slug: "home-office",
      image: "/images/layout-category-11.png",
      icon: "🏠",
      color: "#F1F8E9",
      sortOrder: 11,
    },
    {
      name: "Personal Care",
      slug: "personal-care",
      image: "/images/layout-category-12.png",
      icon: "🧴",
      color: "#EDE7F6",
      sortOrder: 12,
    },
    {
      name: "Pet Care",
      slug: "pet-care",
      image: "/images/layout-category-13.png",
      icon: "🐾",
      color: "#FFF3E0",
      sortOrder: 13,
    },
    {
      name: "Baby Care",
      slug: "baby-care",
      image: "/images/layout-category-14.png",
      icon: "👶",
      color: "#E8EAF6",
      sortOrder: 14,
    },
    {
      name: "Pharma & Wellness",
      slug: "pharma-wellness",
      image: "/images/layout-category-15.png",
      icon: "💊",
      color: "#E8F5E9",
      sortOrder: 15,
    },
    {
      name: "Electronics & Electricals",
      slug: "electronics",
      image: "/images/layout-category-16.png",
      icon: "📱",
      color: "#E3F2FD",
      sortOrder: 16,
    },
    {
      name: "Paan Corner",
      slug: "paan-corner",
      image: "/images/category-paan.avif",
      icon: "🍃",
      color: "#E8F5E9",
      sortOrder: 17,
    },
  ];

  const catMap = {};
  for (const c of CATEGORIES) {
    const existing = await db.collection("categories").findOne({ slug: c.slug });
    if (existing) {
      await db.collection("categories").updateOne({ _id: existing._id }, { $set: c });
      catMap[c.slug] = existing._id;
    } else {
      const res = await db.collection("categories").insertOne({ ...c, isActive: true, createdAt: new Date() });
      catMap[c.slug] = res.insertedId;
    }
  }
  console.log(`Synced ${Object.keys(catMap).length} categories with Blinkit layout images!`);

  // Download and parse data.js
  const rawData = await fetchText("https://raw.githubusercontent.com/jibi966/blinkit_clone/main/scripts/data.js");
  
  // Extract all objects: { cat: "...", image: "...", name: "...", price: "...", wt: "..." }
  const regex = /cat:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?price:\s*"([^"]+)"[\s\S]*?wt:\s*"([^"]+)"/g;
  let match;
  const productsToInsert = [];

  const catCategoryMapping = {
    veg: "vegetables-fruits",
    fruits: "vegetables-fruits",
    pulses: "atta-rice-dal",
    Atta: "atta-rice-dal",
    Rice: "atta-rice-dal",
    oil: "atta-rice-dal",
    ghee: "atta-rice-dal",
    Dry: "munchies",
    soft: "cold-drinks-juices",
    juice: "cold-drinks-juices",
    soda: "cold-drinks-juices",
    energyDrink: "cold-drinks-juices",
    water: "cold-drinks-juices",
    herbalDrink: "tea-coffee-health",
    haircare: "personal-care",
    oralcare: "personal-care",
    soaps: "personal-care",
    skincare: "personal-care"
  };

  while ((match = regex.exec(rawData)) !== null) {
    const [_, cat, image, name, priceStr, wt] = match;
    const price = parseInt(priceStr) || 40;
    const mrp = Math.round(price * 1.25);
    const discount = Math.round(((mrp - price) / mrp) * 100);
    const targetCatSlug = catCategoryMapping[cat] || "vegetables-fruits";
    const catId = catMap[targetCatSlug];

    productsToInsert.push({
      title: name,
      slug: slugify(name) + "-" + Math.floor(Math.random() * 1000),
      category: catId,
      images: [{ url: image, publicId: "" }],
      price,
      mrp,
      discount,
      unit: wt,
      stock: 100,
      tags: [cat, targetCatSlug, "groceries", "fast-delivery"],
      isAvailable: true,
      isFeatured: Math.random() > 0.65,
      sortOrder: 0,
      rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
      ratingCount: Math.floor(100 + Math.random() * 2500),
      createdAt: new Date(),
    });
  }

  // Also add iconic Blinkit Dairy, Snacks, Sweets, and Paan products
  const curatedProducts = [
    {
      title: "Amul Gold Full Cream Fresh Milk",
      unit: "500 ml",
      price: 34,
      mrp: 35,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=450/da/cms-assets/cms/product/628c97e0-5ed4-425d-a667-1d3bfa6f0bde.png",
      featured: true,
    },
    {
      title: "Amul Taaza Toned Fresh Milk",
      unit: "500 ml",
      price: 27,
      mrp: 28,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/19512a.jpg",
      featured: true,
    },
    {
      title: "Amul Salted Butter",
      unit: "100 g",
      price: 58,
      mrp: 60,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/160a.jpg",
      featured: true,
    },
    {
      title: "Mother Dairy Classic Curd / Dahi",
      unit: "400 g",
      price: 35,
      mrp: 35,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/19512a.jpg",
      featured: true,
    },
    {
      title: "Harvest Gold White Bread",
      unit: "400 g",
      price: 45,
      mrp: 50,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/24194a.jpg",
      featured: true,
    },
    {
      title: "Fresh Farm White Eggs (Pack of 6)",
      unit: "6 pcs",
      price: 54,
      mrp: 65,
      cat: "dairy-breakfast",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/120002a.jpg",
      featured: true,
    },
    {
      title: "Lay's India's Magic Masala Potato Chips",
      unit: "50 g",
      price: 20,
      mrp: 20,
      cat: "munchies",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/10894a.jpg",
      featured: true,
    },
    {
      title: "Kurkure Masala Munch Crisps",
      unit: "85 g",
      price: 20,
      mrp: 20,
      cat: "munchies",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/240092a.jpg",
      featured: true,
    },
    {
      title: "Haldiram's Nagpur Aloo Bhujia",
      unit: "200 g",
      price: 55,
      mrp: 60,
      cat: "munchies",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/54050a.jpg",
      featured: true,
    },
    {
      title: "Coca-Cola Original Soft Drink",
      unit: "750 ml",
      price: 40,
      mrp: 40,
      cat: "cold-drinks-juices",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/287a.jpg",
      featured: true,
    },
    {
      title: "Thums Up Charged Soft Drink",
      unit: "750 ml",
      price: 40,
      mrp: 40,
      cat: "cold-drinks-juices",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/304a.jpg",
      featured: true,
    },
    {
      title: "Sprite Lime Flavored Cold Drink",
      unit: "750 ml",
      price: 40,
      mrp: 40,
      cat: "cold-drinks-juices",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/311a.jpg",
      featured: true,
    },
    {
      title: "Cadbury Dairy Milk Silk Chocolate Bar",
      unit: "150 g",
      price: 175,
      mrp: 180,
      cat: "sweet-tooth",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/160823a.jpg",
      featured: true,
    },
    {
      title: "Nestle KitKat 4 Finger Wafer Bar",
      unit: "38 g",
      price: 30,
      mrp: 30,
      cat: "sweet-tooth",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/14833a.jpg",
      featured: true,
    },
    {
      title: "Maggi 2-Minute Masala Instant Noodles",
      unit: "70 g (Pack of 4)",
      price: 56,
      mrp: 60,
      cat: "instant-frozen-food",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/11516a.jpg",
      featured: true,
    },
    {
      title: "Nescafe Classic Instant Coffee Jar",
      unit: "50 g",
      price: 170,
      mrp: 180,
      cat: "tea-coffee-health",
      img: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=85,metadata=none,w=250,h=250/app/images/products/sliding_image/12022a.jpg",
      featured: true,
    },
    {
      title: "Pampers Baby Dry Diaper Pants (Large)",
      unit: "34 pcs",
      price: 549,
      mrp: 699,
      cat: "baby-care",
      img: "/images/babycare-promo.avif",
      featured: true,
    },
    {
      title: "Pedigree Adult Dry Dog Food - Meat & Rice",
      unit: "1.2 kg",
      price: 310,
      mrp: 340,
      cat: "pet-care",
      img: "/images/petcare-promo.avif",
      featured: true,
    },
    {
      title: "Dolo 650mg Paracetamol Tablets",
      unit: "15 tablets",
      price: 32,
      mrp: 34,
      cat: "pharma-wellness",
      img: "/images/pharmacy-promo.avif",
      featured: true,
    },
    {
      title: "Premium Sweet Meetha Paan",
      unit: "1 pc",
      price: 30,
      mrp: 35,
      cat: "paan-corner",
      img: "/images/category-paan.avif",
      featured: true,
    }
  ];

  for (const cp of curatedProducts) {
    const catId = catMap[cp.cat] || catMap["vegetables-fruits"];
    const mrp = cp.mrp || cp.price;
    const discount = Math.round(((mrp - cp.price) / mrp) * 100);
    productsToInsert.push({
      title: cp.title,
      slug: slugify(cp.title) + "-" + Math.floor(Math.random() * 1000),
      category: catId,
      images: [{ url: cp.img, publicId: "" }],
      price: cp.price,
      mrp,
      discount,
      unit: cp.unit,
      stock: 120,
      tags: [cp.cat, "blinkit-signature", "best-seller"],
      isAvailable: true,
      isFeatured: cp.featured || true,
      sortOrder: 1,
      rating: 4.8,
      ratingCount: 3400,
      createdAt: new Date(),
    });
  }

  // Seed Dark Stores / Warehouses (ER Model: store)
  const storesToInsert = [
    {
      name: "Blinkit Dark Store #101 - Cyber Hub",
      code: "STORE-GGN-101",
      city: "Gurugram",
      area: "DLF Cyber City",
      address: "Building 10B, DLF Cyber Hub, Sector 24",
      pincode: "122002",
      phone: "0124-4112233",
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: "Blinkit Dark Store #102 - Sector 56",
      code: "STORE-GGN-102",
      city: "Gurugram",
      area: "Golf Course Road",
      address: "Shop 14-16, Huda Market, Sector 56",
      pincode: "122011",
      phone: "0124-4556677",
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: "Blinkit Dark Store #103 - Saket",
      code: "STORE-DEL-103",
      city: "New Delhi",
      area: "Saket District Centre",
      address: "Plot 3, Community Center, Saket",
      pincode: "110017",
      phone: "011-26554433",
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: "Blinkit Dark Store #104 - Indiranagar",
      code: "STORE-BLR-104",
      city: "Bengaluru",
      area: "Indiranagar 100ft Road",
      address: "420, 100 Feet Rd, HAL 2nd Stage, Indiranagar",
      pincode: "560038",
      phone: "080-4998877",
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: "Blinkit Dark Store #105 - Koramangala",
      code: "STORE-BLR-105",
      city: "Bengaluru",
      area: "Koramangala 4th Block",
      address: "88, 80 Feet Rd, 4th Block, Koramangala",
      pincode: "560034",
      phone: "080-4112345",
      isActive: true,
      createdAt: new Date(),
    },
  ];

  await db.collection("stores").deleteMany({});
  const storeResult = await db.collection("stores").insertMany(storesToInsert);
  const primaryStoreId = storeResult.insertedIds[0];
  console.log(`Successfully seeded ${storeResult.insertedCount} Blinkit Dark Stores!`);

  // Seed Delivery Partners (ER Model: delivery_partner)
  const partnersToInsert = [
    {
      firstName: "Ramesh",
      lastName: "Yadav",
      name: "Ramesh Yadav",
      phone: "9876543210",
      email: "ramesh.yadav@blinkitdelivery.com",
      city: "Gurugram",
      status: "available",
      vehicleType: "Bike",
      vehicleNumber: "HR-26-BR-1234",
      rating: 4.9,
      totalDeliveries: 342,
      currentStore: primaryStoreId,
      isActive: true,
      createdAt: new Date(),
    },
    {
      firstName: "Suresh",
      lastName: "Verma",
      name: "Suresh Verma",
      phone: "9876543211",
      email: "suresh.v@blinkitdelivery.com",
      city: "Gurugram",
      status: "busy",
      vehicleType: "EV Scooter",
      vehicleNumber: "HR-26-EV-5678",
      rating: 4.8,
      totalDeliveries: 512,
      currentStore: primaryStoreId,
      isActive: true,
      createdAt: new Date(),
    },
    {
      firstName: "Vikas",
      lastName: "Kumar",
      name: "Vikas Kumar",
      phone: "9876543212",
      email: "vikas.k@blinkitdelivery.com",
      city: "New Delhi",
      status: "available",
      vehicleType: "Bike",
      vehicleNumber: "DL-3C-AS-9012",
      rating: 4.7,
      totalDeliveries: 280,
      currentStore: storeResult.insertedIds[2],
      isActive: true,
      createdAt: new Date(),
    },
    {
      firstName: "Anil",
      lastName: "Gowda",
      name: "Anil Gowda",
      phone: "9876543213",
      email: "anil.g@blinkitdelivery.com",
      city: "Bengaluru",
      status: "available",
      vehicleType: "Bike",
      vehicleNumber: "KA-01-EQ-3456",
      rating: 4.9,
      totalDeliveries: 420,
      currentStore: storeResult.insertedIds[3],
      isActive: true,
      createdAt: new Date(),
    },
    {
      firstName: "Deepak",
      lastName: "Singh",
      name: "Deepak Singh",
      phone: "9876543214",
      email: "deepak.s@blinkitdelivery.com",
      city: "Bengaluru",
      status: "offline",
      vehicleType: "EV Scooter",
      vehicleNumber: "KA-03-EV-7890",
      rating: 4.6,
      totalDeliveries: 195,
      currentStore: storeResult.insertedIds[4],
      isActive: true,
      createdAt: new Date(),
    },
  ];

  await db.collection("deliverypartners").deleteMany({});
  const partnerResult = await db.collection("deliverypartners").insertMany(partnersToInsert);
  console.log(`Successfully seeded ${partnerResult.insertedCount} Blinkit Delivery Partners!`);

  // Assign primaryStoreId to products
  for (const p of productsToInsert) {
    p.storeId = primaryStoreId;
  }

  // Clear existing products and reseed
  await db.collection("products").deleteMany({});
  const result = await db.collection("products").insertMany(productsToInsert);
  console.log(`Successfully seeded ${result.insertedCount} authentic Blinkit products!`);

  // Seed inventory records per store (ER Model: inventory)
  const inventoryToInsert = [];
  const insertedProductIds = Object.values(result.insertedIds);
  for (const sId of Object.values(storeResult.insertedIds)) {
    for (const pId of insertedProductIds) {
      inventoryToInsert.push({
        store: sId,
        product: pId,
        stock: Math.floor(Math.random() * 80) + 10,
        lowStockThreshold: 10,
        lastRestockedAt: new Date(),
        createdAt: new Date(),
      });
    }
  }

  await db.collection("inventories").deleteMany({});
  const invResult = await db.collection("inventories").insertMany(inventoryToInsert);
  console.log(`Successfully seeded ${invResult.insertedCount} inventory records across all stores!`);

  await mongoose.disconnect();
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
