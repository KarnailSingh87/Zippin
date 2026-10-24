import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

const API = "";

function ShelfCarousel({ title, subtitle, products, slug }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-8 px-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <Link
              href={`/category/${slug}`}
              className="text-xs md:text-sm font-bold text-[#0C831F] hover:underline mr-2"
            >
              see all →
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal List */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {products.map((p) => (
          <div key={p._id} className="w-[160px] sm:w-[185px] shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, featRes, allRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/products?featured=true&limit=20`),
          fetch(`${API}/api/products?limit=120`),
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (featRes.ok) setFeatured(await featRes.json());
        if (allRes.ok) setAllProducts(await allRes.json());
      } catch (e) {
        console.error("Failed to load Blinkit store data", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Filter products by slug or keyword
  const getProductsByCatSlug = (slugKeywords) => {
    return allProducts.filter((p) => {
      const catSlug = p.category?.slug || "";
      const tags = p.tags || [];
      const title = (p.title || "").toLowerCase();
      return (
        slugKeywords.some((k) => catSlug.includes(k)) ||
        slugKeywords.some((k) => tags.includes(k)) ||
        slugKeywords.some((k) => title.includes(k))
      );
    });
  };

  const dairyProducts = getProductsByCatSlug(["dairy", "breakfast", "milk", "bread", "egg", "butter", "curd"]);
  const snacksProducts = getProductsByCatSlug(["munchies", "chips", "snack", "kurkure", "lays", "bhujia"]);
  const drinksProducts = getProductsByCatSlug(["cold-drinks", "juice", "soda", "coca", "pepsi", "sprite", "thums"]);
  const freshProduce = getProductsByCatSlug(["vegetables", "fruits", "veg", "onion", "tomato", "potato", "carrot"]);
  const sweetsProducts = getProductsByCatSlug(["sweet", "ice-cream", "chocolate", "silk", "kitkat"]);
  const staplesProducts = getProductsByCatSlug(["atta", "rice", "dal", "pulses", "oil"]);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
        <div className="h-44 sm:h-56 rounded-2xl shimmer" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-28 rounded-2xl shimmer" />
          <div className="h-28 rounded-2xl shimmer" />
          <div className="h-28 rounded-2xl shimmer" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-7xl mx-auto">
      {/* 1. Hero Promo Banner: Blinkit Paan Corner / Grocery Special */}
      <div className="px-4 pt-4">
        <Link href="/category/paan-corner" className="block group">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-sm border border-gray-200/80 bg-white">
            <img
              src="/images/banner-paan.webp"
              alt="Blinkit Paan Corner & Quick Commerce"
              className="w-full h-auto max-h-[220px] md:max-h-[270px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              onError={(e) => {
                e.currentTarget.src = "/images/banner-hero.jpg";
              }}
            />
          </div>
        </Link>
      </div>

      {/* 2. Three Lifestyle Promo Tiles: Pharmacy, Pet Care, Baby Care */}
      <div className="px-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Link
          href="/category/pharma-wellness"
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group border border-gray-200/80 bg-white"
        >
          <img
            src="/images/pharmacy-promo.avif"
            alt="Pharmacy in 10 mins"
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
        </Link>

        <Link
          href="/category/pet-care"
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group border border-gray-200/80 bg-white"
        >
          <img
            src="/images/petcare-promo.avif"
            alt="Pet Care Store"
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
        </Link>

        <Link
          href="/category/baby-care"
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group border border-gray-200/80 bg-white"
        >
          <img
            src="/images/babycare-promo.avif"
            alt="Baby Care Essentials"
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
        </Link>
      </div>

      {/* 3. Category Matrix: The Iconic Blinkit Category Tiles */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Everything delivered in 8-10 minutes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2.5 sm:gap-3">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center p-2 rounded-2xl bg-white border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-gray-200 transition-all duration-200 group text-center"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center p-1 relative overflow-hidden">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {cat.icon || "🛒"}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-800 leading-tight mt-1 line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Horizontal Shelf: Dairy, Bread & Eggs */}
      <ShelfCarousel
        title="Dairy, Bread & Eggs"
        subtitle="Fresh milk, butter, cheese, curd & daily essentials"
        products={dairyProducts.length > 0 ? dairyProducts : allProducts.slice(0, 8)}
        slug="dairy-breakfast"
      />

      {/* 5. Horizontal Shelf: Snacks & Munchies */}
      <ShelfCarousel
        title="Snacks & Munchies"
        subtitle="Crispy chips, namkeen, wafers & party snacks"
        products={snacksProducts.length > 0 ? snacksProducts : allProducts.slice(8, 16)}
        slug="munchies"
      />

      {/* 6. Horizontal Shelf: Cold Drinks & Juices */}
      <ShelfCarousel
        title="Cold Drinks & Juices"
        subtitle="Chilled sodas, fruit juices & energy drinks"
        products={drinksProducts.length > 0 ? drinksProducts : allProducts.slice(16, 24)}
        slug="cold-drinks-juices"
      />

      {/* 7. Horizontal Shelf: Farm Fresh Vegetables & Fruits */}
      <ShelfCarousel
        title="Vegetables & Fruits"
        subtitle="Fresh from the farm with strict quality checks"
        products={freshProduce.length > 0 ? freshProduce : allProducts.slice(24, 32)}
        slug="vegetables-fruits"
      />

      {/* 8. Horizontal Shelf: Sweet Tooth & Ice Cream */}
      <ShelfCarousel
        title="Sweet Tooth & Chocolates"
        subtitle="Chocolates, desserts & sweet cravings"
        products={sweetsProducts.length > 0 ? sweetsProducts : allProducts.slice(32, 40)}
        slug="sweet-tooth"
      />

      {/* 9. Horizontal Shelf: Atta, Rice & Dal */}
      <ShelfCarousel
        title="Atta, Rice & Dal"
        subtitle="Premium grains, staples & cooking essentials"
        products={staplesProducts.length > 0 ? staplesProducts : allProducts.slice(0, 8)}
        slug="atta-rice-dal"
      />

      {/* 10. Featured Deals Grid */}
      {featured.length > 0 && (
        <div className="mt-10 px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
                ⚡ Lowest Prices & Best Deals
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Specially curated discounts for maximum savings
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {featured.slice(0, 12).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
