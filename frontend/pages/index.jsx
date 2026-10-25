import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

const API = "";

const HERO_SLIDES = [
  {
    id: "paan",
    image: "/images/banner-paan.webp",
    fallback: "/images/banner-hero.jpg",
    title: "Paan Corner & Refreshments",
    link: "/category/paan-corner",
  },
];

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
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
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
              className="text-xs md:text-sm font-extrabold text-[#0C831F] hover:underline mr-1"
            >
              see all →
            </Link>
          )}
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal Product List */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {products.map((p) => (
          <div key={p._id} className="w-[165px] sm:w-[185px] md:w-[195px] shrink-0">
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState(HERO_SLIDES);
  const [lifestyleTiles, setLifestyleTiles] = useState([
    {
      title: "Pharmacy in 10 mins",
      image: "/images/pharmacy-promo.avif",
      link: "/category/pharma-wellness",
    },
    {
      title: "Pet Care Store",
      image: "/images/petcare-promo.avif",
      link: "/category/pet-care",
    },
    {
      title: "Baby Care Essentials",
      image: "/images/babycare-promo.avif",
      link: "/category/baby-care",
    },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, featRes, allRes, bannerRes] = await Promise.all([
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/products?featured=true&limit=30`),
          fetch(`${API}/api/products?limit=300`),
          fetch(`${API}/api/banners?activeOnly=true`),
        ]);
        if (catRes.ok) setCategories(await catRes.json());
        if (featRes.ok) setFeatured(await featRes.json());
        if (allRes.ok) setAllProducts(await allRes.json());
        if (bannerRes.ok) {
          const fetchedBanners = await bannerRes.json();
          const heroes = fetchedBanners.filter((b) => b.type === "hero");
          const tiles = fetchedBanners.filter((b) => b.type === "promo_tile");
          if (heroes.length > 0) {
            // Keep unique hero banners (only 1 Paan corner banner)
            const uniqueHeroes = [];
            const seen = new Set();
            for (const h of heroes) {
              const key = h.image || h.title;
              if (!seen.has(key)) {
                seen.add(key);
                uniqueHeroes.push(h);
              }
            }
            setHeroSlides(uniqueHeroes.slice(0, 1));
          }
          if (tiles.length > 0) setLifestyleTiles(tiles);
        }
      } catch (e) {
        console.error("Failed to load Zippin store data", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Auto advance banner slide only when there are multiple slides
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides?.length]);

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
  const paanProducts = getProductsByCatSlug(["paan-corner", "paan", "meetha", "mints", "freshener", "gum", "rolling"]);
  const bakeryProducts = getProductsByCatSlug(["bakery-biscuits", "bakery", "biscuit", "cookies", "oreo", "bourbon", "good-day", "pav"]);
  const pharmaProducts = getProductsByCatSlug(["pharma-wellness", "pharma", "crocin", "vicks", "pain", "band-aid", "digene", "eno", "electral"]);
  const sweetsProducts = getProductsByCatSlug(["sweet", "ice-cream", "chocolate", "silk", "kitkat", "ferrero"]);
  const staplesProducts = getProductsByCatSlug(["atta", "rice", "dal", "pulses", "oil"]);
  const petProducts = getProductsByCatSlug(["pet-care", "dog", "cat", "pedigree", "whiskas", "drools"]);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
        <div className="h-44 sm:h-64 rounded-3xl shimmer" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-32 rounded-2xl shimmer" />
          <div className="h-32 rounded-2xl shimmer" />
          <div className="h-32 rounded-2xl shimmer" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 max-w-7xl mx-auto">
      {/* Semantic Single H1 for SEO */}
      <h1 className="sr-only">Zippin - Instant Groceries and Essentials in 8-10 Minutes</h1>

      {/* 1. Hero Promo Banner Carousel (Paan Corner & Superfast Delivery) */}
      <div className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xs border border-gray-200/80 bg-white">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {heroSlides.map((slide, idx) => (
              <div key={slide._id || slide.id || idx} className="min-w-full">
                <Link href={slide.link || "/category/vegetables-fruits"} className="block group">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto max-h-[220px] md:max-h-[280px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                    onError={(e) => {
                      e.currentTarget.src = slide.fallback || "/images/banner-hero.jpg";
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide ? "w-6 bg-white shadow-sm" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Three Lifestyle Promo Tiles: Pharmacy, Pet Care, Baby Care */}
      <div className="px-4 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {lifestyleTiles.map((tile, idx) => (
          <Link
            key={tile._id || idx}
            href={tile.link || "/category/pharma-wellness"}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 group border border-gray-200/80 bg-white"
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
            />
          </Link>
        ))}
      </div>

      {/* 3. Category Matrix: The Iconic Zippin Category Tiles */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              10,000+ items delivered to your doorstep in 8-10 minutes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center p-2 rounded-2xl bg-white border border-gray-100/90 shadow-2xs hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 group text-center"
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

      {/* 3. Shelf: "Buy Again" Frequently Ordered Essentials */}
      <ShelfCarousel
        title="Buy Again"
        subtitle="Frequently ordered staples and daily groceries for quick 1-tap re-ordering"
        products={dairyProducts.length > 0 ? dairyProducts.slice(0, 8) : allProducts.slice(0, 8)}
        slug="dairy-breakfast"
      />

      {/* 4. Shelf: Paan Corner & Refreshments */}
      <ShelfCarousel
        title="🍃 Paan Corner & Refreshments"
        subtitle="Handcrafted Meetha Paan, mouth fresheners, mints & smoking essentials"
        products={paanProducts.length > 0 ? paanProducts : allProducts.slice(0, 10)}
        slug="paan-corner"
      />

      {/* 5. Shelf: Bakery & Biscuits */}
      <ShelfCarousel
        title="Bakery & Biscuits"
        subtitle="Fresh bread, artisanal pav, butter cookies & chocolate biscuits"
        products={bakeryProducts.length > 0 ? bakeryProducts : allProducts.slice(10, 20)}
        slug="bakery-biscuits"
      />

      {/* 6. Shelf: Dairy, Bread & Eggs */}
      <ShelfCarousel
        title="Dairy, Bread & Eggs"
        subtitle="Fresh milk, butter, cheese, curd & daily morning essentials"
        products={dairyProducts.length > 0 ? dairyProducts : allProducts.slice(0, 10)}
        slug="dairy-breakfast"
      />

      {/* 7. Shelf: Snacks & Munchies */}
      <ShelfCarousel
        title="Snacks & Munchies"
        subtitle="Crispy chips, namkeen, wafers & movie-night munchies"
        products={snacksProducts.length > 0 ? snacksProducts : allProducts.slice(10, 20)}
        slug="munchies"
      />

      {/* 8. Shelf: Cold Drinks & Juices */}
      <ShelfCarousel
        title="Cold Drinks & Juices"
        subtitle="Chilled sodas, sparkling water, fruit juices & energy boosters"
        products={drinksProducts.length > 0 ? drinksProducts : allProducts.slice(20, 30)}
        slug="cold-drinks-juices"
      />

      {/* 9. Shelf: Farm Fresh Vegetables & Fruits */}
      <ShelfCarousel
        title="Vegetables & Fruits"
        subtitle="Directly from certified farms with strict freshness checks"
        products={freshProduce.length > 0 ? freshProduce : allProducts.slice(30, 40)}
        slug="vegetables-fruits"
      />

      {/* 10. Shelf: Pharma & Wellness */}
      <ShelfCarousel
        title="Pharma & Wellness"
        subtitle="Pain relief, first aid, cold care & fast-acting digestion remedies"
        products={pharmaProducts.length > 0 ? pharmaProducts : allProducts.slice(20, 30)}
        slug="pharma-wellness"
      />

      {/* 11. Shelf: Sweet Tooth & Chocolates */}
      <ShelfCarousel
        title="Sweet Tooth & Chocolates"
        subtitle="Cadbury, KitKat, wafer bars & ice cream treats"
        products={sweetsProducts.length > 0 ? sweetsProducts : allProducts.slice(40, 50)}
        slug="sweet-tooth"
      />

      {/* 12. Shelf: Atta, Rice & Dal */}
      <ShelfCarousel
        title="Atta, Rice & Dal"
        subtitle="Premium grains, lentils, pulses & daily kitchen staples"
        products={staplesProducts.length > 0 ? staplesProducts : allProducts.slice(0, 10)}
        slug="atta-rice-dal"
      />

      {/* 10. Lowest Prices & Best Deals Section */}
      {featured.length > 0 && (
        <div className="mt-12 px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                ⚡ Lowest Prices & Best Deals
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Specially curated discounts and daily savings on top brands
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
