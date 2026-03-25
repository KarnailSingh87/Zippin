import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

const API = '';

type Category = { _id: string; name: string; slug: string; icon: string; color: string };
type Product = { _id: string; title: string; slug: string; price: number; mrp: number; unit: string; images: any[]; discount: number; category: any; isFeatured: boolean; tags: string[]; rating: number; ratingCount: number };

const BANNER_SLIDES = [
  { title: 'Fresh Vegetables', subtitle: 'Up to 30% off on farm-fresh veggies', color: 'from-green-600 to-emerald-500', emoji: '🥬' },
  { title: 'Dairy Essentials', subtitle: 'Milk, curd & more at best prices', color: 'from-amber-500 to-orange-400', emoji: '🥛' },
  { title: 'Munchies & Snacks', subtitle: 'Buy 2 Get 1 free on select items', color: 'from-pink-500 to-rose-400', emoji: '🍿' },
  { title: 'Cold Drinks', subtitle: 'Beat the heat with chilled beverages', color: 'from-blue-500 to-cyan-400', emoji: '🥤' },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, featRes, allRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/products?featured=true&limit=12`),
          fetch(`${API}/api/products?limit=50`)
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (featRes.ok) setFeatured(await featRes.json());
        if (allRes.ok) setAllProducts(await allRes.json());
      } catch (e) {
        console.error('Failed to load data', e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % BANNER_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  allProducts.forEach(p => {
    const catName = p.category?.name || 'Other';
    if (!productsByCategory[catName]) productsByCategory[catName] = [];
    productsByCategory[catName].push(p);
  });

  if (loading) {
    return (
      <div className="px-4 py-6">
        {/* Shimmer loading */}
        <div className="h-40 rounded-2xl shimmer mb-6" />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-60 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      {/* Hero Banner Carousel */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {BANNER_SLIDES.map((slide, i) => (
              <div key={i} className={`min-w-full bg-gradient-to-r ${slide.color} p-6 md:p-8 flex items-center justify-between`}>
                <div className="text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-80">Limited Time Offer</p>
                  <h2 className="text-xl md:text-3xl font-black mb-1">{slide.title}</h2>
                  <p className="text-sm md:text-base opacity-90">{slide.subtitle}</p>
                  <button className="mt-3 bg-white text-gray-800 rounded-lg px-4 py-2 text-xs font-bold hover:bg-gray-100 transition-colors">
                    Order Now →
                  </button>
                </div>
                <span className="text-5xl md:text-7xl">{slide.emoji}</span>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {BANNER_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Shop by Category</h2>
          <Link href="/search" className="text-xs text-blinkit-green font-semibold hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
          {categories.slice(0, 16).map((cat, i) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="category-card flex flex-col items-center justify-center rounded-xl p-3 text-center"
              style={{
                backgroundColor: cat.color || '#f0f0f0',
                animationDelay: `${i * 50}ms`
              }}
            >
              <span className="text-2xl md:text-3xl mb-1">{cat.icon || '📦'}</span>
              <span className="text-[10px] md:text-xs font-semibold text-gray-700 leading-tight line-clamp-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured / Deals */}
      {featured.length > 0 && (
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">⚡ Deals of the Day</h2>
              <p className="text-xs text-gray-500">Handpicked deals just for you</p>
            </div>
          </div>
          <div className="px-4 overflow-x-auto no-scrollbar" ref={scrollRef}>
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {featured.map(p => (
                <div key={p._id} className="w-36 sm:w-40 shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products by Category */}
      {Object.entries(productsByCategory).map(([catName, products]) => (
        <div key={catName} className="mt-6">
          <div className="px-4 flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">{catName}</h2>
            <button className="text-xs text-blinkit-green font-semibold hover:underline">see all →</button>
          </div>
          <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {products.slice(0, 6).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {allProducts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-6xl mb-4">🛒</span>
          <h2 className="text-xl font-bold text-gray-600 mb-2">No products yet</h2>
          <p className="text-sm text-gray-400 mb-4">Make sure the backend is running and seeded</p>
          <p className="text-xs text-gray-300">Run: curl -X POST http://localhost:4000/api/internal/seed</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-10 bg-white border-t border-gray-200 px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="text-xl font-black text-blinkit-green">blink</span>
            <span className="text-xl font-black text-blinkit-yellow">it</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">© 2025 Blinkit Clone. Groceries delivered in 10 minutes.</p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span>🏪 1000+ Products</span>
            <span>⚡ 10 Min Delivery</span>
            <span>🎉 Best Prices</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
