import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ProductCard from "../../components/ProductCard";

const API = "";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    if (!slug) return;
    let isCancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [catRes, catsRes] = await Promise.all([
          fetch(`${API}/api/categories/${slug}`),
          fetch(`${API}/api/categories`),
        ]);

        let catData = null;
        if (catRes.ok) {
          catData = await catRes.json();
          if (!isCancelled) setCategory(catData);
        }

        let allCats = [];
        if (catsRes.ok) {
          allCats = await catsRes.json();
          if (!isCancelled) setAllCategories(allCats);
        }

        // If direct lookup didn't find category, attempt matching by slug from list
        if (!catData && allCats.length > 0) {
          catData = allCats.find(
            (c) =>
              c.slug.toLowerCase() === slug.toLowerCase() ||
              c.name.toLowerCase().includes(slug.toLowerCase())
          );
          if (catData && !isCancelled) setCategory(catData);
        }

        // Load products by category ID or slug
        const categoryQueryParam = catData?._id || slug;
        const prodRes = await fetch(
          `${API}/api/products?category=${categoryQueryParam}&limit=100`
        );
        if (prodRes.ok && !isCancelled) {
          const prods = await prodRes.json();
          setProducts(prods);
        }
      } catch (e) {
        console.error("Failed to load category data", e);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  // Client-side sorting
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "price_asc") {
      return list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    if (sortBy === "price_desc") {
      return list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    if (sortBy === "discount") {
      return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list; // 'popular' maintains default server order
  }, [products, sortBy]);

  const currentSlug = category?.slug || slug;

  return (
    <>
      <Head>
        <title>
          {category?.name ? `${category.name} | Zippin 10-Min Delivery` : "Category | Zippin"}
        </title>
      </Head>

      <div className="flex min-h-screen bg-[#F4F6FB]">
        {/* Category Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-gray-200/80 py-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
          <h3 className="px-5 text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
            Categories
          </h3>
          <div className="space-y-0.5">
            {allCategories.map((c) => {
              const isActive = c.slug === currentSlug || c.slug === slug;
              return (
                <Link
                  key={c._id}
                  href={`/category/${c.slug}`}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-50/80 text-[#0C831F] border-r-4 border-[#0C831F] font-black"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-8 h-8 object-contain rounded-lg shrink-0"
                    />
                  ) : (
                    <span className="text-xl shrink-0">{c.icon || "🛒"}</span>
                  )}
                  <span className="truncate">{c.name}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main Product Area */}
        <div className="flex-1 px-4 py-5 pb-20 md:pb-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <Link href="/" className="hover:text-[#0C831F] font-medium">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">
              {category?.name || slug}
            </span>
          </div>

          {/* Category Header Banner */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-emerald-50/70 p-2 flex items-center justify-center shrink-0">
                {category?.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-3xl">{category?.icon || "🛒"}</span>
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  {category?.name || "Category"}
                </h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {products.length} products available for instant delivery
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100/80 text-gray-600 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span>⚡ Delivery in 8-10 minutes</span>
            </div>
          </div>

          {/* Mobile categories horizontal pill bar */}
          <div className="md:hidden overflow-x-auto no-scrollbar mb-4 -mx-4 px-4">
            <div className="flex gap-2" style={{ width: "max-content" }}>
              {allCategories.map((c) => {
                const isActive = c.slug === currentSlug || c.slug === slug;
                return (
                  <Link
                    key={c._id}
                    href={`/category/${c.slug}`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors shadow-2xs ${
                      isActive
                        ? "bg-[#0C831F] text-white"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <span>{c.icon || "🛒"}</span>
                    )}
                    <span>{c.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Filter / Sort Control Strip */}
          {products.length > 0 && (
            <div className="flex items-center justify-between gap-3 mb-4 bg-white p-2.5 rounded-xl border border-gray-200/80">
              <span className="text-xs font-bold text-gray-600 pl-2">
                Showing {sortedProducts.length} items
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0C831F]"
                >
                  <option value="popular">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          )}

          {/* Products Grid or Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl shimmer" />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-200/80 p-8">
              <span className="text-5xl mb-3">🔍</span>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                No products found in this category
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Explore other categories for fresh groceries, snacks, and daily staples.
              </p>
              <Link
                href="/"
                className="bg-[#0C831F] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#0a701b] transition-colors"
              >
                Browse All Categories
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
