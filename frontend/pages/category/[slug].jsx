import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";

const API = "";

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      try {
        const [catRes, catsRes] = await Promise.all([
          fetch(`${API}/api/categories/${slug}`),
          fetch(`${API}/api/categories`),
        ]);
        if (catRes.ok) {
          const cat = await catRes.json();
          setCategory(cat);
          const prodRes = await fetch(
            `${API}/api/products?category=${cat._id}&limit=50`
          );
          if (prodRes.ok) setProducts(await prodRes.json());
        }
        if (catsRes.ok) setAllCategories(await catsRes.json());
      } catch (e) {
        console.error("Failed to load category", e);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="h-8 w-48 shimmer rounded-xl mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6FB]">
      {/* Category Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 bg-white border-r border-gray-200/80 py-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
        <h3 className="px-5 text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
          Categories
        </h3>
        <div className="space-y-0.5">
          {allCategories.map((c) => {
            const isActive = c.slug === slug;
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
      <div className="flex-1 px-4 py-5 pb-20 md:pb-8">
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
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200/80 shadow-xs flex items-center justify-between gap-4 mb-6">
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
            <span>⚡ Delivery in 8 minutes</span>
          </div>
        </div>

        {/* Mobile categories horizontal pill bar */}
        <div className="md:hidden overflow-x-auto no-scrollbar mb-4 -mx-4 px-4">
          <div className="flex gap-2" style={{ width: "max-content" }}>
            {allCategories.map((c) => {
              const isActive = c.slug === slug;
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

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products.map((p) => (
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
  );
}
