import "dotenv/config";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import Category from "./src/models/Category.js";
import Store from "./src/models/Store.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blinkit";

const CATALOG = [
  // 1. PAAN CORNER
  {
    categorySlug: "paan-corner",
    items: [
      {
        title: "Calculatta Meetha Sweet Paan (Freshly Handcrafted)",
        price: 35,
        mrp: 40,
        unit: "1 pc",
        tags: ["paan", "paan-corner", "sweet-paan", "mouth-freshener", "best-seller"],
        rating: 4.9,
        ratingCount: 5210,
        images: [{ url: "/images/category-paan.avif", publicId: "" }],
      },
      {
        title: "Banarasi Saada Paan (Traditional Supreme)",
        price: 30,
        mrp: 35,
        unit: "1 pc",
        tags: ["paan", "paan-corner", "banarasi", "saada-paan"],
        rating: 4.8,
        ratingCount: 3820,
        images: [{ url: "/images/category-paan.avif", publicId: "" }],
      },
      {
        title: "Chocolate Truffle Delight Paan",
        price: 50,
        mrp: 60,
        unit: "1 pc",
        tags: ["paan", "paan-corner", "chocolate", "dessert"],
        rating: 4.9,
        ratingCount: 4120,
        images: [{ url: "/images/category-paan.avif", publicId: "" }],
      },
      {
        title: "Pass Pass Sweet Fragrant Mouth Freshener (Pack of 5)",
        price: 50,
        mrp: 50,
        unit: "5 x 10.5g",
        tags: ["paan-corner", "mouth-freshener", "pass-pass", "mints"],
        rating: 4.7,
        ratingCount: 2980,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Rajnigandha Silver Pearls Elaichi Dispenser",
        price: 60,
        mrp: 60,
        unit: "6.25g dispenser",
        tags: ["paan-corner", "rajnigandha", "silver-pearls", "elaichi", "mouth-freshener"],
        rating: 4.8,
        ratingCount: 6150,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Baba 160 Silver Coated Supari Elaichi Mix",
        price: 75,
        mrp: 80,
        unit: "2.5g can",
        tags: ["paan-corner", "baba", "mouth-freshener", "supari"],
        rating: 4.6,
        ratingCount: 1820,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Center Fresh Spearmint Chewing Gum Stick (Pack of 5)",
        price: 50,
        mrp: 50,
        unit: "5 sticks",
        tags: ["paan-corner", "gum", "center-fresh", "spearmint", "mints"],
        rating: 4.9,
        ratingCount: 9400,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Orbit Spearmint Sugarfree Chewing Gum Bottle",
        price: 70,
        mrp: 75,
        unit: "30 pellets",
        tags: ["paan-corner", "orbit", "sugarfree", "chewing-gum", "mints"],
        rating: 4.8,
        ratingCount: 8120,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Tic Tac Fresh Mint & Orange Pocket Candy (Pack of 2)",
        price: 40,
        mrp: 40,
        unit: "2 x 14.5g",
        tags: ["paan-corner", "tic-tac", "mint", "orange", "mints"],
        rating: 4.8,
        ratingCount: 4890,
        images: [{ url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "RAW Classic King Size Slim Organic Hemp Rolling Papers",
        price: 99,
        mrp: 120,
        unit: "32 leaves",
        tags: ["paan-corner", "raw", "rolling-paper", "smoking-accessories"],
        rating: 4.9,
        ratingCount: 14200,
        images: [{ url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Elements Ultra Thin Pre-Rolled Cones (Pack of 6)",
        price: 130,
        mrp: 150,
        unit: "6 cones",
        tags: ["paan-corner", "elements", "cones", "smoking-accessories"],
        rating: 4.8,
        ratingCount: 7890,
        images: [{ url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Clipper Classic Refillable Utility Gas Lighter",
        price: 65,
        mrp: 75,
        unit: "1 pc",
        tags: ["paan-corner", "clipper", "lighter", "smoking-accessories"],
        rating: 4.7,
        ratingCount: 3900,
        images: [{ url: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Dabur Pudin Hara Active Pearls Fast Digestive",
        price: 30,
        mrp: 35,
        unit: "Pack of 10 pearls",
        tags: ["paan-corner", "pudin-hara", "digestive", "stomach-relief"],
        rating: 4.8,
        ratingCount: 6500,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Dabur Hajmola Regular Ayurvedic Digestive Tablets",
        price: 55,
        mrp: 60,
        unit: "120 tablets bottle",
        tags: ["paan-corner", "hajmola", "digestive", "churan"],
        rating: 4.9,
        ratingCount: 11200,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 2. PHARMA & WELLNESS
  {
    categorySlug: "pharma-wellness",
    items: [
      {
        title: "Crocin Advance 650 Fast Action Pain Relief Tablets",
        price: 30,
        mrp: 33,
        unit: "15 tablets",
        tags: ["pharma", "pharma-wellness", "crocin", "paracetamol", "fever", "pain-relief"],
        rating: 4.9,
        ratingCount: 8900,
        images: [{ url: "/images/pharmacy-promo.avif", publicId: "" }],
      },
      {
        title: "Vicks VapoRub Cold, Cough & Congestion Relief Balm",
        price: 95,
        mrp: 105,
        unit: "50ml tub",
        tags: ["pharma", "pharma-wellness", "vicks", "cold", "balm"],
        rating: 4.9,
        ratingCount: 14300,
        images: [{ url: "/images/pharmacy-promo.avif", publicId: "" }],
      },
      {
        title: "Band-Aid Waterproof Antiseptic Adhesive Strips",
        price: 45,
        mrp: 50,
        unit: "Pack of 20 strips",
        tags: ["pharma", "pharma-wellness", "band-aid", "first-aid", "antiseptic"],
        rating: 4.8,
        ratingCount: 7600,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Digene Gel Acidity & Gas Relief Liquid (Mint Flavour)",
        price: 135,
        mrp: 150,
        unit: "200ml bottle",
        tags: ["pharma", "pharma-wellness", "digene", "acidity", "digestion"],
        rating: 4.8,
        ratingCount: 6200,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Eno Fruit Salt Lemon Flavour Fast Acting Sachet",
        price: 54,
        mrp: 60,
        unit: "Pack of 6 sachets",
        tags: ["pharma", "pharma-wellness", "eno", "acidity", "lemon"],
        rating: 4.9,
        ratingCount: 18400,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Electral ORS Ready-to-Drink Energy & Hydration (Apple)",
        price: 35,
        mrp: 40,
        unit: "200ml tetrapack",
        tags: ["pharma", "pharma-wellness", "electral", "ors", "hydration"],
        rating: 4.8,
        ratingCount: 9100,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Volini Joint & Muscle Pain Relief Spray",
        price: 140,
        mrp: 160,
        unit: "40g spray can",
        tags: ["pharma", "pharma-wellness", "volini", "pain-relief", "spray"],
        rating: 4.8,
        ratingCount: 10400,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Dettol Antiseptic Disinfectant Liquid",
        price: 110,
        mrp: 125,
        unit: "250ml bottle",
        tags: ["pharma", "pharma-wellness", "dettol", "first-aid", "antiseptic"],
        rating: 4.9,
        ratingCount: 22100,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Limcee 500mg Vitamin C Orange Chewable Tablets",
        price: 24,
        mrp: 26,
        unit: "15 chewable tablets",
        tags: ["pharma", "pharma-wellness", "vitamin-c", "immunity", "supplements"],
        rating: 4.8,
        ratingCount: 15300,
        images: [{ url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 3. PET CARE
  {
    categorySlug: "pet-care",
    items: [
      {
        title: "Pedigree Adult Dry Dog Food - Chicken & Vegetables",
        price: 780,
        mrp: 850,
        unit: "3 kg pack",
        tags: ["pet-care", "dog-food", "pedigree", "adult-dog"],
        rating: 4.8,
        ratingCount: 6700,
        images: [{ url: "/images/petcare-promo.avif", publicId: "" }],
      },
      {
        title: "Whiskas Adult Wet Cat Food - Ocean Fish in Jelly Gravy",
        price: 480,
        mrp: 540,
        unit: "Pack of 12 pouches (85g each)",
        tags: ["pet-care", "cat-food", "whiskas", "wet-food"],
        rating: 4.9,
        ratingCount: 5400,
        images: [{ url: "/images/petcare-promo.avif", publicId: "" }],
      },
      {
        title: "Drools Real Chicken & Egg Adult Dog Biscuits",
        price: 180,
        mrp: 200,
        unit: "500g jar",
        tags: ["pet-care", "dog-treats", "drools", "biscuits"],
        rating: 4.7,
        ratingCount: 3800,
        images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Me-O Creamy Lickable Cat Treats - Salmon Flavour",
        price: 120,
        mrp: 140,
        unit: "4 x 15g pack",
        tags: ["pet-care", "cat-treats", "me-o", "salmon"],
        rating: 4.9,
        ratingCount: 4100,
        images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Gnawlers Calcium Milk Dental Chew Bones for Dogs",
        price: 260,
        mrp: 300,
        unit: "Pack of 30 chew bones",
        tags: ["pet-care", "dog-chew", "calcium-bones", "dental-care"],
        rating: 4.8,
        ratingCount: 3100,
        images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Himalaya Erina-EP Anti-Tick & Flea Pet Shampoo",
        price: 190,
        mrp: 220,
        unit: "200ml bottle",
        tags: ["pet-care", "pet-shampoo", "himalaya", "tick-flea"],
        rating: 4.7,
        ratingCount: 2900,
        images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Emily Pets Clumping Lavender Scented Cat Litter",
        price: 360,
        mrp: 420,
        unit: "5 Litre bag",
        tags: ["pet-care", "cat-litter", "lavender", "clumping"],
        rating: 4.8,
        ratingCount: 2200,
        images: [{ url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 4. BABY CARE
  {
    categorySlug: "baby-care",
    items: [
      {
        title: "Pampers All Round Protection Pants - Large (L)",
        price: 949,
        mrp: 1199,
        unit: "64 Diaper Pants",
        tags: ["baby-care", "pampers", "diapers", "baby-pants"],
        rating: 4.9,
        ratingCount: 16500,
        images: [{ url: "/images/babycare-promo.avif", publicId: "" }],
      },
      {
        title: "Pampers Active Baby Diaper Pants - Medium (M)",
        price: 899,
        mrp: 1099,
        unit: "72 Diaper Pants",
        tags: ["baby-care", "pampers", "medium-diapers"],
        rating: 4.8,
        ratingCount: 14200,
        images: [{ url: "/images/babycare-promo.avif", publicId: "" }],
      },
      {
        title: "Huggies Wonder Pants Extra Absorbent Diapers - XL",
        price: 999,
        mrp: 1299,
        unit: "56 Diaper Pants",
        tags: ["baby-care", "huggies", "diapers"],
        rating: 4.8,
        ratingCount: 11300,
        images: [{ url: "/images/babycare-promo.avif", publicId: "" }],
      },
      {
        title: "Himalaya Gentle Baby Aloe Vera Cleansing Wipes",
        price: 175,
        mrp: 210,
        unit: "Pack of 72 wipes",
        tags: ["baby-care", "baby-wipes", "himalaya", "aloe-vera"],
        rating: 4.9,
        ratingCount: 18900,
        images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Sebamed Children's Gentle Soap-Free Body Wash",
        price: 420,
        mrp: 460,
        unit: "200ml pump bottle",
        tags: ["baby-care", "sebamed", "baby-wash", "sensitive-skin"],
        rating: 4.9,
        ratingCount: 4500,
        images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Johnson's Baby Cornstarch Soothing Powder",
        price: 240,
        mrp: 275,
        unit: "400g pack",
        tags: ["baby-care", "johnsons", "baby-powder"],
        rating: 4.8,
        ratingCount: 8900,
        images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Nestle Cerelac Wheat Apple Baby Cereal (Stage 1)",
        price: 285,
        mrp: 310,
        unit: "300g refill bib",
        tags: ["baby-care", "cerelac", "nestle", "baby-food"],
        rating: 4.9,
        ratingCount: 9700,
        images: [{ url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 5. BAKERY & BISCUITS
  {
    categorySlug: "bakery-biscuits",
    items: [
      {
        title: "Britannia Good Day Rich Butter Cookies Family Pack",
        price: 110,
        mrp: 130,
        unit: "600g (Pack of 6)",
        tags: ["bakery", "bakery-biscuits", "good-day", "cookies", "britannia"],
        rating: 4.8,
        ratingCount: 24500,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Oreo Original Vanilla Creme Sandwich Biscuits",
        price: 75,
        mrp: 85,
        unit: "300g (Pack of 3)",
        tags: ["bakery", "bakery-biscuits", "oreo", "chocolate-biscuit"],
        rating: 4.9,
        ratingCount: 31200,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Parle-G Gold Bigger & Tastier Glucose Biscuits",
        price: 90,
        mrp: 100,
        unit: "1 kg mega pack",
        tags: ["bakery", "bakery-biscuits", "parle-g", "tea-time"],
        rating: 4.9,
        ratingCount: 42100,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Britannia Bourbon Chocolate Creme Delight",
        price: 40,
        mrp: 45,
        unit: "150g pack",
        tags: ["bakery", "bakery-biscuits", "bourbon", "chocolate"],
        rating: 4.8,
        ratingCount: 16800,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Sunfeast Dark Fantasy Choco Fills Premium Cookies",
        price: 135,
        mrp: 160,
        unit: "300g box",
        tags: ["bakery", "bakery-biscuits", "dark-fantasy", "choco-fills"],
        rating: 4.9,
        ratingCount: 19400,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Britannia 100% Whole Wheat Bread (Zero Maida)",
        price: 50,
        mrp: 55,
        unit: "400g loaf",
        tags: ["bakery", "bakery-biscuits", "wheat-bread", "breakfast"],
        rating: 4.8,
        ratingCount: 22100,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "English Oven Jumbo White Sandwich Bread",
        price: 55,
        mrp: 60,
        unit: "400g loaf",
        tags: ["bakery", "bakery-biscuits", "sandwich-bread", "breakfast"],
        rating: 4.7,
        ratingCount: 14800,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
      {
        title: "Fresh Mumbai Artisanal Soft Ladi Pav",
        price: 35,
        mrp: 40,
        unit: "Pack of 6 pav",
        tags: ["bakery", "bakery-biscuits", "ladi-pav", "vada-pav", "pav-bhaji"],
        rating: 4.9,
        ratingCount: 17600,
        images: [{ url: "/images/category-bakery.avif", publicId: "" }],
      },
    ],
  },

  // 6. INSTANT & FROZEN FOOD
  {
    categorySlug: "instant-frozen-food",
    items: [
      {
        title: "Maggi 2-Minute Masala Instant Noodles Family Pack",
        price: 156,
        mrp: 168,
        unit: "12-Pack (840g)",
        tags: ["instant-food", "maggi", "noodles", "fast-food", "best-seller"],
        rating: 4.9,
        ratingCount: 58000,
        images: [{ url: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "McCain Crispy French Fries (Extra Long Cut)",
        price: 199,
        mrp: 235,
        unit: "1.25 kg party pack",
        tags: ["instant-food", "frozen", "mccain", "french-fries", "snacks"],
        rating: 4.8,
        ratingCount: 24000,
        images: [{ url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "McCain Smiles Crispy Mashed Potato Shapes",
        price: 145,
        mrp: 165,
        unit: "750g pack",
        tags: ["instant-food", "frozen", "mccain-smiles", "potato-shapes"],
        rating: 4.9,
        ratingCount: 19800,
        images: [{ url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "ITC Master Chef Crispy Chicken Nuggets",
        price: 240,
        mrp: 280,
        unit: "500g pouch",
        tags: ["instant-food", "frozen", "chicken-nuggets", "itc-masterchef"],
        rating: 4.8,
        ratingCount: 11200,
        images: [{ url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Godrej Yummiez Crispy Veg Burger Patty",
        price: 130,
        mrp: 150,
        unit: "360g (Pack of 4)",
        tags: ["instant-food", "frozen", "burger-patty", "godrej-yummiez"],
        rating: 4.7,
        ratingCount: 8900,
        images: [{ url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Knorr Classic Thick Cream of Tomato Soup",
        price: 55,
        mrp: 60,
        unit: "Pack of 2 (53g each)",
        tags: ["instant-food", "knorr", "soup", "tomato-soup"],
        rating: 4.7,
        ratingCount: 7800,
        images: [{ url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Haldiram's Ready-to-Eat Gulab Jamun Tin",
        price: 220,
        mrp: 250,
        unit: "1 kg tin",
        tags: ["instant-food", "sweets", "gulab-jamun", "haldirams"],
        rating: 4.9,
        ratingCount: 15600,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
    ],
  },

  // 7. SWEET TOOTH & CHOCOLATES
  {
    categorySlug: "sweet-tooth",
    items: [
      {
        title: "Cadbury Dairy Milk Silk Chocolate Bar",
        price: 165,
        mrp: 175,
        unit: "150g bar",
        tags: ["sweet-tooth", "cadbury", "silk", "chocolate", "dessert"],
        rating: 4.9,
        ratingCount: 38000,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "Ferrero Rocher Premium Crisp Hazelnut Chocolates",
        price: 499,
        mrp: 549,
        unit: "Pack of 16 pieces (200g)",
        tags: ["sweet-tooth", "ferrero-rocher", "luxury-chocolate", "gift"],
        rating: 4.9,
        ratingCount: 18700,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "Cadbury Dairy Milk Roast Almond Bar",
        price: 175,
        mrp: 185,
        unit: "143g bar",
        tags: ["sweet-tooth", "cadbury", "almond-chocolate"],
        rating: 4.8,
        ratingCount: 14200,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "KitKat 4-Finger Crispy Wafer Share Pack",
        price: 140,
        mrp: 160,
        unit: "Pack of 8 (152g)",
        tags: ["sweet-tooth", "kitkat", "wafer-bar", "nestle"],
        rating: 4.9,
        ratingCount: 22500,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "Kwality Wall's Cornetto Double Chocolate Cone",
        price: 160,
        mrp: 180,
        unit: "Multipack of 4 (420ml)",
        tags: ["sweet-tooth", "ice-cream", "cornetto", "chocolate-cone"],
        rating: 4.8,
        ratingCount: 16900,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "Baskin Robbins Mississippi Mud Ice Cream Tub",
        price: 340,
        mrp: 375,
        unit: "450ml tub",
        tags: ["sweet-tooth", "ice-cream", "baskin-robbins", "mississippi-mud"],
        rating: 4.9,
        ratingCount: 11400,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
      {
        title: "Amul Alphonso Real Mango Ice Cream Tub",
        price: 210,
        mrp: 230,
        unit: "1 Litre tub",
        tags: ["sweet-tooth", "ice-cream", "amul", "alphonso-mango"],
        rating: 4.8,
        ratingCount: 15300,
        images: [{ url: "/images/category-sweet.avif", publicId: "" }],
      },
    ],
  },

  // 8. CLEANING ESSENTIALS
  {
    categorySlug: "cleaning-essentials",
    items: [
      {
        title: "Surf Excel Matic Top Load Detergent Powder",
        price: 380,
        mrp: 430,
        unit: "2 kg bag",
        tags: ["cleaning", "detergent", "surf-excel", "laundry"],
        rating: 4.9,
        ratingCount: 26000,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Ariel Matic Front Load Liquid Detergent",
        price: 230,
        mrp: 260,
        unit: "1 Litre pouch",
        tags: ["cleaning", "detergent", "ariel", "liquid-detergent"],
        rating: 4.8,
        ratingCount: 18200,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Vim Lemon Dishwash Gel with Scrub Sponge",
        price: 155,
        mrp: 175,
        unit: "750ml bottle",
        tags: ["cleaning", "dishwash", "vim", "kitchen-cleaning"],
        rating: 4.9,
        ratingCount: 34100,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Harpic Power Plus Disinfectant Toilet Cleaner",
        price: 195,
        mrp: 220,
        unit: "1 Litre bottle",
        tags: ["cleaning", "harpic", "toilet-cleaner", "bathroom"],
        rating: 4.9,
        ratingCount: 29800,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Lizol Disinfectant Surface & Floor Cleaner (Citrus)",
        price: 215,
        mrp: 245,
        unit: "1 Litre bottle",
        tags: ["cleaning", "lizol", "floor-cleaner", "disinfectant"],
        rating: 4.8,
        ratingCount: 24500,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Colin Ultra Glass and Multi-Surface Cleaner Spray",
        price: 105,
        mrp: 120,
        unit: "500ml trigger spray",
        tags: ["cleaning", "colin", "glass-cleaner", "surface-spray"],
        rating: 4.8,
        ratingCount: 19300,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Scotch-Brite Heavy Duty Scrub Sponge",
        price: 75,
        mrp: 85,
        unit: "Pack of 3 sponges",
        tags: ["cleaning", "scotch-brite", "sponge", "dishwash"],
        rating: 4.9,
        ratingCount: 31200,
        images: [{ url: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 9. HOME & OFFICE
  {
    categorySlug: "home-office",
    items: [
      {
        title: "Duracell Ultra Alkaline AA Batteries (Pack of 4)",
        price: 170,
        mrp: 190,
        unit: "4 AA Batteries",
        tags: ["home-office", "duracell", "batteries", "aa-battery"],
        rating: 4.9,
        ratingCount: 16400,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Duracell Ultra Alkaline AAA Batteries (Pack of 4)",
        price: 170,
        mrp: 190,
        unit: "4 AAA Batteries",
        tags: ["home-office", "duracell", "batteries", "aaa-battery"],
        rating: 4.9,
        ratingCount: 15200,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Classmate Pulse Spiral Bound Long Notebook",
        price: 95,
        mrp: 110,
        unit: "300 Pages (A4 Size)",
        tags: ["home-office", "classmate", "notebook", "stationery"],
        rating: 4.8,
        ratingCount: 8900,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Cello Gripper Blue Smooth Ballpoint Pens (Pack of 5)",
        price: 50,
        mrp: 50,
        unit: "5 Pens",
        tags: ["home-office", "cello", "pens", "stationery"],
        rating: 4.8,
        ratingCount: 12400,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Scotch Magic Invisible Tape with Hand Dispenser",
        price: 85,
        mrp: 99,
        unit: "1 Roll (19mm x 7.6m)",
        tags: ["home-office", "scotch", "tape", "stationery"],
        rating: 4.8,
        ratingCount: 6500,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Fevikwik Instant Super Fast Adhesive",
        price: 40,
        mrp: 40,
        unit: "Pack of 4 (1g each)",
        tags: ["home-office", "fevikwik", "glue", "instant-adhesive"],
        rating: 4.9,
        ratingCount: 28400,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Syska 4-Socket Surge Protector Extension Cord with Master Switch",
        price: 349,
        mrp: 499,
        unit: "2 Metres Cord",
        tags: ["home-office", "syska", "extension-board", "surge-protector"],
        rating: 4.7,
        ratingCount: 7800,
        images: [{ url: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },

  // 10. ELECTRONICS & ELECTRICALS
  {
    categorySlug: "electronics",
    items: [
      {
        title: "boAt Bassheads 100 Wired Earphones with Mic (Black)",
        price: 399,
        mrp: 999,
        unit: "1 pc",
        tags: ["electronics", "boat", "earphones", "wired-earphones"],
        rating: 4.8,
        ratingCount: 38900,
        images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Portronics Konnect CL Type-C to Lightning Fast Charging Cable",
        price: 299,
        mrp: 699,
        unit: "1.2 Metres",
        tags: ["electronics", "portronics", "iphone-cable", "lightning-cable", "fast-charging"],
        rating: 4.7,
        ratingCount: 14500,
        images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Mi 22.5W Fast USB Type-C Wall Charger Adapter",
        price: 499,
        mrp: 799,
        unit: "1 pc",
        tags: ["electronics", "xiaomi", "wall-charger", "fast-charger"],
        rating: 4.8,
        ratingCount: 22100,
        images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "SanDisk Ultra 64GB High Speed MicroSDXC Memory Card",
        price: 449,
        mrp: 850,
        unit: "Class 10 U1",
        tags: ["electronics", "sandisk", "sd-card", "memory-card"],
        rating: 4.9,
        ratingCount: 19800,
        images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
      {
        title: "Ambrane 10000mAh Slim Power Bank with 20W PD Fast Charging",
        price: 899,
        mrp: 1499,
        unit: "1 pc (Type-C + USB-A)",
        tags: ["electronics", "ambrane", "power-bank", "fast-charging"],
        rating: 4.8,
        ratingCount: 16700,
        images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=70", publicId: "" }],
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB for rich catalog seeding...");

  const defaultStore = await Store.findOne({ code: "STR-HMR-501" }) || await Store.findOne();
  if (!defaultStore) {
    console.error("No store found! Please run seed_operational_data.js first.");
    process.exit(1);
  }

  let totalAdded = 0;

  for (const group of CATALOG) {
    const cat = await Category.findOne({ slug: group.categorySlug });
    if (!cat) {
      console.warn(`Category slug ${group.categorySlug} not found in DB! Skipping group.`);
      continue;
    }

    console.log(`\nSeeding products for category: ${cat.name} (${cat.slug})...`);

    for (const item of group.items) {
      // Check if product with this title already exists
      const existing = await Product.findOne({ title: item.title });
      if (existing) {
        // update category and availability
        existing.category = cat._id;
        existing.storeId = defaultStore._id;
        existing.isAvailable = true;
        await existing.save();
        console.log(`  Updated existing: ${item.title}`);
        continue;
      }

      const slug = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 50) + "-" + Math.floor(100 + Math.random() * 900);

      const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;

      const newProd = new Product({
        title: item.title,
        slug,
        category: cat._id,
        storeId: defaultStore._id,
        price: item.price,
        mrp: item.mrp,
        discount,
        unit: item.unit,
        stock: Math.floor(40 + Math.random() * 80),
        tags: item.tags,
        isAvailable: true,
        isFeatured: Math.random() > 0.6,
        rating: item.rating || 4.8,
        ratingCount: item.ratingCount || 1200,
        images: item.images,
        sortOrder: 1,
      });

      await newProd.save();
      totalAdded++;
      console.log(`  + Created: ${item.title} (₹${item.price})`);
    }
  }

  console.log(`\nDone! Successfully seeded ${totalAdded} genuine products across categories.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
