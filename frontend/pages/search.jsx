import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProductCard from "../components/ProductCard";

const API = "";

export default function SearchPage() {
  const router = useRouter();
  const q = router.query.q || "";
  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/api/products?q=${encodeURIComponent(query)}&limit=50`,
        );
        if (res.ok) setProducts(await res.json());
      } catch {}
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="px-4 py-4 pb-20 md:pb-6 min-h-screen">
      {/* Search input */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder='Search for "milk, bread, eggs..."'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            router.replace(
              `/search?q=${encodeURIComponent(e.target.value)}`,
              undefined,
              { shallow: true },
            );
          }}
          className="w-full py-3 pl-11 pr-4 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-zippin-green focus:border-transparent"
          autoFocus
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              router.replace("/search", undefined, { shallow: true });
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 rounded-xl shimmer" />
          ))}
        </div>
      ) : query && products.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-3">
            Showing {products.length} result{products.length !== 1 ? "s" : ""}{" "}
            for "{query}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      ) : query ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">🔍</span>
          <p className="text-sm font-medium">No results for "{query}"</p>
          <p className="text-xs mt-1">Try a different search term</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">🔎</span>
          <p className="text-sm font-medium">Search for products</p>
          <p className="text-xs mt-1">Try "milk", "chips", or "bread"</p>
        </div>
      )}
    </div>
  );
}
