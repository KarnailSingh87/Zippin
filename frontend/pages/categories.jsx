import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>All Categories | Zippin - Instant Delivery in 8 Minutes</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Explore All Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Browse fresh groceries, snacks, beverages and household essentials delivered in 8 minutes.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {categories.map((c) => (
              <Link
                key={c._id || c.slug}
                href={`/category/${c.slug}`}
                className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform">
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">🛍️</span>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#0C831F] line-clamp-2">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
