import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function AISearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Search logic across products, orders, categories, stores
  useEffect(() => {
    if (!query.trim()) {
      // Default quick suggestions
      setResults([
        { type: "action", label: "Delivery Fleet Riders (10 Active Riders)", path: "/riders", badge: "Fleet", icon: "🛵" },
        { type: "action", label: "Store Pickers & Packers (6 In-Store Pickers)", path: "/pickers", badge: "SLA Velocity", icon: "📦" },
        { type: "action", label: "Manage Homepage Banners & Posters", path: "/hero-management", badge: "Hero Editor", icon: "🖼️" },
        { type: "action", label: "Live Customer Orders & Fulfillment", path: "/orders", badge: "Orders", icon: "📋" },
        { type: "action", label: "Revenue & Settlements Analytics", path: "/revenue", badge: "Finance", icon: "💰" },
      ]);
      setSelectedIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase().trim();
      const matched = [];

      // Static shortcut checks
      if ("riders".includes(q) || "delivery".includes(q) || "fleet".includes(q) || "bike".includes(q)) {
        matched.push({
          type: "action",
          label: "View Delivery Riders & Fleet Management",
          sub: "10 registered delivery riders at Hamirpur Store",
          path: "/riders",
          badge: "Fleet Page",
          icon: "🛵",
        });
      }
      if ("pickers".includes(q) || "packers".includes(q) || "picking".includes(q) || "warehouse".includes(q)) {
        matched.push({
          type: "action",
          label: "View Store Pickers & Assembly Management",
          sub: "6 active pickers, 82s avg pick speed SLA",
          path: "/pickers",
          badge: "Pickers Page",
          icon: "📦",
        });
      }

      try {
        const token = localStorage.getItem("admin_token");
        const [prodRes, ordRes, catRes, storeRes, partnerRes] = await Promise.all([
          fetch(`/api/products?limit=100`),
          fetch(`/api/orders/all`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
          fetch(`/api/categories`),
          fetch(`/api/stores`),
          fetch(`/api/delivery-partners`),
        ]);

        if (partnerRes.ok) {
          const partners = await partnerRes.json();
          partners
            .filter((p) => p.name?.toLowerCase().includes(q) || p.phone?.includes(q) || p.vehicleNumber?.toLowerCase().includes(q))
            .slice(0, 3)
            .forEach((p) => {
              const isPicker = p.role === "picker";
              matched.push({
                type: isPicker ? "picker" : "rider",
                label: p.name,
                sub: isPicker
                  ? `Store Picker • Shift: ${p.shift || "Morning"} • Speed: ${p.pickingSpeedSec || 80}s`
                  : `Delivery Rider • Vehicle: ${p.vehicleNumber || p.vehicleType || "EV"}`,
                path: isPicker ? `/pickers?search=${encodeURIComponent(p.name)}` : `/riders?search=${encodeURIComponent(p.name)}`,
                badge: isPicker ? "Picker" : "Rider",
                icon: isPicker ? "📦" : "🛵",
              });
            });
        }

        if (prodRes.ok) {
          const prods = await prodRes.json();
          prods
            .filter((p) => p.title?.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q))
            .slice(0, 4)
            .forEach((p) => {
              matched.push({
                type: "product",
                label: p.title,
                sub: `₹${p.price} • ${p.category?.name || "Grocery"}`,
                path: `/products?search=${encodeURIComponent(p.title)}`,
                badge: "Product",
                image: p.image,
              });
            });
        }

        if (ordRes.ok) {
          const ords = await ordRes.json();
          ords
            .filter((o) => o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.customerPhone?.includes(q))
            .slice(0, 3)
            .forEach((o) => {
              matched.push({
                type: "order",
                label: `${o.orderNumber} - ${o.customerName || "Customer"}`,
                sub: `₹${o.total} • Status: ${o.status?.toUpperCase()}`,
                path: `/orders?search=${encodeURIComponent(o.orderNumber)}`,
                badge: "Order",
                icon: "📋",
              });
            });
        }

        if (catRes.ok) {
          const cats = await catRes.json();
          cats
            .filter((c) => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q))
            .slice(0, 2)
            .forEach((c) => {
              matched.push({
                type: "category",
                label: c.name,
                sub: `Category slug: ${c.slug}`,
                path: `/categories`,
                badge: "Category",
                icon: "📂",
              });
            });
        }

        if (storeRes.ok) {
          const stores = await storeRes.json();
          stores
            .filter((s) => s.name?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q))
            .slice(0, 2)
            .forEach((s) => {
              matched.push({
                type: "store",
                label: s.name,
                sub: s.address || s.city,
                path: `/stores`,
                badge: "Store Facility",
                icon: "🏬",
              });
            });
        }
      } catch (err) {
        console.error("AI Search error:", err);
      }

      setResults(matched);
      setSelectedIndex(0);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onClose();
    if (item?.path) {
      router.push(item.path);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c1017]">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, orders, categories, store inventory..."
            className="w-full bg-transparent text-sm md:text-base font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          )}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1.5 py-0.5 rounded mr-2"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-gray-50 dark:divide-gray-800/60">
          {results.length === 0 && query && !loading && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found for <span className="font-semibold text-gray-700 dark:text-gray-200">"{query}"</span>
            </div>
          )}

          {results.map((item, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={index}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex-shrink-0 p-0.5"
                    />
                  ) : (
                    <span className="text-xl flex-shrink-0 w-8 text-center">{item.icon || "🔍"}</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-semibold truncate text-gray-900 dark:text-gray-100">{item.label}</p>
                    {item.sub && <p className="text-[11px] text-gray-600 dark:text-gray-400 truncate">{item.sub}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.type === "product"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        : item.type === "order"
                        ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                        : item.type === "action"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        : "bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-gray-50/70 dark:bg-[#0c1017] px-4 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span className="text-[#0C831F] dark:text-emerald-400 font-bold">Zippin Omnisearch</span>
        </div>
      </div>
    </div>
  );
}
