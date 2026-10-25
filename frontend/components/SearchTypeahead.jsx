import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

const PLACEHOLDERS = [
  'Search "milk"',
  'Search "bread"',
  'Search "chips"',
  'Search "curd"',
  'Search "butter"',
  'Search "ice cream"',
  'Search "atta"',
  'Search "eggs"',
  'Search "cold drinks"',
  'Search "chocolate"',
  'Search "tomato"',
  'Search "onion"'
];

export default function SearchTypeahead({ mobile = false, onClose, className = "" }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const ref = useRef(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setProducts([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    timerRef.current = setTimeout(async () => {
      const q = encodeURIComponent(query.trim());
      const prodUrl = `/api/products?q=${q}&limit=6`;
      const catUrl = `/api/categories?q=${q}&limit=6`;
      abortRef.current = new AbortController();

      try {
        const [pRes, cRes] = await Promise.all([
          fetch(prodUrl, { signal: abortRef.current.signal }),
          fetch(catUrl, { signal: abortRef.current.signal }),
        ]);
        if (pRes.ok) setProducts(await pRes.json());
        else setProducts([]);
        if (cRes.ok) setCategories(await cRes.json());
        else setCategories([]);
      } catch (e) {
        if (e.name !== "AbortError") console.error("Typeahead fetch failed", e);
        setProducts([]);
        setCategories([]);
      }
      setLoading(false);
      setShow(true);
      setHighlight(-1);
    }, 220);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [query]);

  function submitSearch(q) {
    const qstr = q || query;
    if (!qstr || qstr.trim() === "") return;
    setShow(false);
    if (onClose) onClose();
    router.push(`/search?q=${encodeURIComponent(qstr.trim())}`);
  }

  function onKey(e) {
    if (!show) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, products.length + categories.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const total = [
        ...products.map((p) => ({ type: "product", item: p })),
        ...categories.map((c) => ({ type: "category", item: c })),
      ];
      if (highlight >= 0 && highlight < total.length) {
        const sel = total[highlight];
        if (sel.type === "category") {
          setShow(false);
          if (onClose) onClose();
          router.push(`/category/${sel.item.slug}`);
        } else {
          submitSearch(sel.item.title || sel.item.name || query);
        }
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setShow(false);
    }
  }

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      <div className="relative w-full flex items-center">
        <svg
          className="absolute left-3.5 w-4 h-4 text-gray-500 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.3}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          placeholder={PLACEHOLDERS[placeholderIndex]}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
          }}
          onKeyDown={onKey}
          className="w-full py-2.5 pl-10 pr-9 rounded-xl bg-[#F4F6FB] border border-gray-200/80 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] transition-all"
          autoFocus={mobile}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShow(false);
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {show && (products.length > 0 || categories.length > 0 || loading) && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-80 overflow-y-auto animate-fade-in">
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500 font-medium">
              Searching grocery shelves…
            </div>
          )}

          {categories.length > 0 && (
            <div className="pb-1">
              <div className="text-[11px] px-3 py-1 text-gray-400 font-bold uppercase tracking-wider">
                Categories
              </div>
              {categories.map((c, i) => (
                <button
                  key={c._id}
                  onClick={() => {
                    setShow(false);
                    if (onClose) onClose();
                    router.push(`/category/${c.slug}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-sm flex items-center gap-3 transition-colors ${
                    highlight === i ? "bg-gray-100" : ""
                  }`}
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-8 h-8 object-contain rounded-lg shrink-0"
                    />
                  ) : (
                    <span className="text-xl shrink-0">{c.icon || "📦"}</span>
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">{c.name}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="pt-1 border-t border-gray-100">
              <div className="text-[11px] px-3 py-1 text-gray-400 font-bold uppercase tracking-wider">
                Products
              </div>
              {products.map((p, i) => {
                const idx = i + categories.length;
                return (
                  <div
                    key={p._id}
                    className={`px-3 py-2 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors ${
                      highlight === idx ? "bg-gray-100" : ""
                    }`}
                  >
                    <img
                      src={
                        p.images?.[0]?.url ||
                        `https://placehold.co/48x48/f0f0f0/666?text=Zippin`
                      }
                      alt={p.title}
                      className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 shrink-0"
                    />
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => submitSearch(p.title)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-800 truncate">
                          {p.title}
                        </span>
                        {p.stock > 0 && p.stock <= 3 && (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 shrink-0">
                            Only {p.stock} left
                          </span>
                        )}
                        {p.stock > 3 && p.stock <= 8 && (
                          <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-1 py-0.2 rounded shrink-0">
                            🔥 Fast
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        ₹{p.price} {p.unit && <span>• {p.unit}</span>}
                      </div>
                    </div>
                    {p.stock <= 0 || p.isAvailable === false ? (
                      <button
                        disabled
                        className="text-[10px] bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-bold border border-gray-200 cursor-not-allowed select-none"
                      >
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          addItem(p);
                        }}
                        className="text-xs bg-[#0C831F] hover:bg-[#0a701b] text-white px-3 py-1 rounded-lg font-bold transition-transform active:scale-95 cursor-pointer"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && categories.length === 0 && (
            <div className="px-4 py-4 text-xs text-gray-500 text-center font-medium">
              No results found for "{query}". Press Enter to search all.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
