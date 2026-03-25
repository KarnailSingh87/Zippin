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
            `${API}/api/products?category=${cat._id}&limit=50`,
          );
          if (prodRes.ok) setProducts(await prodRes.json());
        }
        if (catsRes.ok) setAllCategories(await catsRes.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="h-8 w-48 shimmer rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-60 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:block w-56 shrink-0 bg-white border-r border-gray-200 py-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
        <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Categories
        </h3>
        {allCategories.map((c) => (
          <Link
            key={c._id}
            href={`/category/${c.slug}`}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
              c.slug === slug
                ? "bg-blinkit-green-light text-blinkit-green font-semibold border-r-2 border-blinkit-green"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{c.icon}</span>
            <span className="truncate">{c.name}</span>
          </Link>
        ))}
      </aside>

      {/* Main */}
      <div className="flex-1 px-4 py-4 pb-20 md:pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-blinkit-green">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">
            {category?.name || slug}
          </span>
        </div>

        {/* Category Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{category?.icon || "📦"}</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {category?.name}
            </h1>
            <p className="text-xs text-gray-500">{products.length} products</p>
          </div>
        </div>

        {/* Mobile categories scroll */}
        <div className="md:hidden overflow-x-auto no-scrollbar mb-4">
          <div className="flex gap-2" style={{ width: "max-content" }}>
            {allCategories.map((c) => (
              <Link
                key={c._id}
                href={`/category/${c.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  c.slug === slug
                    ? "bg-blinkit-green text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                <span>{c.icon}</span>
                {c.name}
              </Link>
            ))}
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
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-sm font-medium">No products in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
