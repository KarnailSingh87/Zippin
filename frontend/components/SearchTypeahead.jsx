import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// Lightweight search/typeahead used in header (desktop + mobile)
export default function SearchTypeahead({ mobile = false, onClose, className = "" }) {
  const router = useRouter();
  const { addItem, getQty } = useCart();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

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
      const total = [...products.map(p => ({ type: 'product', item: p })), ...categories.map(c => ({ type: 'category', item: c }))];
      if (highlight >= 0 && highlight < total.length) {
        const sel = total[highlight];
        if (sel.type === 'category') {
          setShow(false);
          if (onClose) onClose();
          router.push(`/category/${sel.item.slug}`);
        } else {
          // product -> navigate to search for now
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
    <div ref={ref} className={`relative ${className}`}>
      <div className={`relative w-full`}> 
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
          placeholder='Search "milk, bread, eggs"'
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShow(true); }}
          onKeyDown={onKey}
          className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blinkit-yellow"
          autoFocus={mobile}
        />
      </div>

      {/* Suggestions dropdown */}
      {show && (products.length > 0 || categories.length > 0 || loading) && (
        <div className={`absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-card p-2 z-50 max-h-72 overflow-auto`}> 
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500">Searching…</div>
          )}

          {categories.length > 0 && (
            <div className="pb-1">
              <div className="text-[11px] px-3 py-1 text-gray-500 font-semibold">Categories</div>
              {categories.map((c, i) => (
                <button
                  key={c._id}
                  onClick={() => { setShow(false); if (onClose) onClose(); router.push(`/category/${c.slug}`); }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm flex items-center gap-3 ${highlight === i ? 'bg-gray-50' : ''}`}
                >
                  <span className="text-xl">{c.icon || '📦'}</span>
                  <div>
                    <div className="font-medium text-gray-800">{c.name}</div>
                    {c.description && <div className="text-[11px] text-gray-400">{c.description}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="pt-1">
              <div className="text-[11px] px-3 py-1 text-gray-500 font-semibold">Products</div>
              {products.map((p, i) => {
                const idx = i + categories.length;
                return (
                  <div key={p._id} className={`px-3 py-2 flex items-center gap-3 hover:bg-gray-50 rounded ${highlight === idx ? 'bg-gray-50' : ''}`}>
                    <img src={p.images?.[0]?.url || `https://placehold.co/48x48/f0f0f0/666?text=${encodeURIComponent((p.title||p.name||''))}`} alt={p.title} className="w-10 h-10 object-contain rounded-md bg-gray-50" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{p.title || p.name}</div>
                      <div className="text-[11px] text-gray-400">₹{p.price} {p.unit && <span>• {p.unit}</span>}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          addItem(p);
                          if (showToast) showToast(`Added to cart — ${p.title || p.name}`);
                        }}
                        className="text-xs bg-blinkit-green text-white px-3 py-1 rounded-lg font-bold"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && products.length === 0 && categories.length === 0 && (
            <div className="px-3 py-3 text-xs text-gray-500">No results. Press Enter to search for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
