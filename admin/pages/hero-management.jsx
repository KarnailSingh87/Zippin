import React, { useState, useEffect } from "react";

const API = "";

const DEFAULT_CATEGORIES = [
  { name: "Paan Corner & Refreshments", slug: "paan-corner" },
  { name: "Vegetables & Fruits", slug: "vegetables-fruits" },
  { name: "Dairy & Breakfast", slug: "dairy-breakfast" },
  { name: "Munchies & Snacks", slug: "munchies" },
  { name: "Cold Drinks & Juices", slug: "cold-drinks-juices" },
  { name: "Instant & Frozen Food", slug: "instant-frozen-food" },
  { name: "Tea, Coffee & Health Drinks", slug: "tea-coffee-health-drinks" },
  { name: "Bakery & Biscuits", slug: "bakery-biscuits" },
  { name: "Sweet Tooth", slug: "sweet-tooth" },
  { name: "Atta, Rice & Dal", slug: "atta-rice-dal" },
  { name: "Masala, Oil & More", slug: "masala-oil-more" },
  { name: "Sauces & Spreads", slug: "sauces-spreads" },
  { name: "Chicken, Meat & Fish", slug: "chicken-meat-fish" },
  { name: "Organic & Healthy Living", slug: "organic-healthy-living" },
  { name: "Baby Care", slug: "baby-care" },
  { name: "Pharma & Wellness", slug: "pharma-wellness" },
  { name: "Cleaning Essentials", slug: "cleaning-essentials" },
  { name: "Pet Care", slug: "pet-care" },
];

export default function HeroManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "Fastest 10 Mins",
    image: "/images/banner-hero.jpg",
    fallback: "/images/banner-paan.webp",
    link: "/category/vegetables-fruits",
    categorySlug: "vegetables-fruits",
    type: "hero",
    order: 1,
    isActive: true,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  async function loadBanners() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/banners`);
      if (res.ok) {
        setBanners(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function handleOpenCreate() {
    setCurrentBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      badge: "10 Mins Delivery",
      image: "/images/banner-hero.jpg",
      fallback: "/images/banner-paan.webp",
      link: "/category/vegetables-fruits",
      categorySlug: "vegetables-fruits",
      type: "hero",
      order: (banners.length || 0) + 1,
      isActive: true,
    });
    setIsEditing(true);
  }

  function handleOpenEdit(banner) {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      badge: banner.badge || "",
      image: banner.image || "",
      fallback: banner.fallback || "",
      link: banner.link || `/category/${banner.categorySlug || "vegetables-fruits"}`,
      categorySlug: banner.categorySlug || "vegetables-fruits",
      type: banner.type || "hero",
      order: banner.order || 1,
      isActive: banner.isActive !== false,
    });
    setIsEditing(true);
  }

  async function handleSaveBanner(e) {
    e.preventDefault();
    try {
      const url = currentBanner
        ? `${API}/api/banners/${currentBanner._id}`
        : `${API}/api/banners`;
      const method = currentBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(currentBanner ? "Banner updated successfully" : "Banner published successfully");
        setIsEditing(false);
        loadBanners();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save banner");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving banner");
    }
  }

  async function handleToggleActive(banner) {
    try {
      const res = await fetch(`${API}/api/banners/${banner._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (res.ok) {
        showToast(`Banner ${!banner.isActive ? "activated" : "deactivated"}`);
        setBanners((prev) =>
          prev.map((b) => (b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteBanner(id) {
    if (!confirm("Are you sure you want to delete this promotional banner?")) return;
    try {
      const res = await fetch(`${API}/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        showToast("Banner deleted successfully");
        setBanners((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filteredBanners = banners.filter((b) => {
    if (activeFilter === "all") return true;
    return b.type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0C831F] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Homepage Hero & Promotional Banners
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-300 text-[10px] font-black uppercase">
              Hero Editor
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage top carousel banners and lifestyle promo posters with instant live redirects to product categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0C831F] hover:bg-[#096618] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span>+</span>
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "all"
              ? "bg-[#0C831F] text-white shadow-xs"
              : "bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800"
          }`}
        >
          All Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveFilter("hero")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "hero"
              ? "bg-[#0C831F] text-white shadow-xs"
              : "bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800"
          }`}
        >
          Hero Slides ({banners.filter((b) => b.type === "hero").length})
        </button>
        <button
          onClick={() => setActiveFilter("promo_tile")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === "promo_tile"
              ? "bg-[#0C831F] text-white shadow-xs"
              : "bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800"
          }`}
        >
          Lifestyle Promo Posters ({banners.filter((b) => b.type === "promo_tile").length})
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading banner assets...
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="col-span-full p-12 text-center text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-[#121212] rounded-2xl border border-gray-200 dark:border-gray-800">
            No banners found in this category.
          </div>
        ) : (
          filteredBanners.map((banner) => (
            <div
              key={banner._id}
              className={`bg-white dark:bg-[#121212] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                banner.isActive
                  ? "border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-md"
                  : "border-gray-200 dark:border-gray-800 opacity-60 bg-gray-50/50 dark:bg-gray-900/40"
              }`}
            >
              <div>
                {/* Banner Thumbnail Preview */}
                <div className="relative aspect-[16/9] w-full bg-gray-100 dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
                    onError={(e) => {
                      e.currentTarget.src = banner.fallback || "/images/banner-hero.jpg";
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                      {banner.type === "hero" ? "Hero Carousel" : "Lifestyle Tile"}
                    </span>
                    {banner.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#0C831F] text-white text-[10px] font-black">
                        {banner.badge}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      title={banner.isActive ? "Deactivate" : "Activate"}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shadow-xs transition-colors cursor-pointer ${
                        banner.isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Banner Meta Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-black text-sm text-gray-900 dark:text-white leading-snug">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-[#0C831F] dark:text-emerald-400 flex items-center gap-1">
                      <span>🔗</span>
                      <span>{banner.link}</span>
                    </span>
                    <span>•</span>
                    <span>Order: #{banner.order}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 px-4 bg-gray-50/70 dark:bg-[#0c1017] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <a
                  href={`http://localhost:3000${banner.link}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Test Link</span>
                  <span>↗</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="px-2.5 py-1 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    title="Delete Banner"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)}>
          <div
            className="bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0c1017]">
              <h2 className="font-black text-base text-gray-900 dark:text-white">
                {currentBanner ? "Edit Promotional Banner" : "Create New Promotional Banner"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBanner} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Type & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Placement Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                  >
                    <option value="hero">Top Hero Carousel Slide</option>
                    <option value="promo_tile">Lifestyle Promo Poster Tile</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Instant Groceries in 8-10 Minutes"
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. 10 Mins"
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Farm fresh vegetables, fruits & daily dairy essentials"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                />
              </div>

              {/* Target Redirect Category */}
              <div>
                <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Target Product Category (Click Redirect)
                </label>
                <select
                  value={formData.categorySlug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categorySlug: e.target.value,
                      link: `/category/${e.target.value}`,
                    })
                  }
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                >
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL with live preview */}
              <div>
                <label className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                  Banner Image URL / Asset Path
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="e.g. /images/banner-paan.webp or CDN image URL"
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                />
                {/* Live Preview */}
                {formData.image && (
                  <div className="mt-2.5 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 aspect-[16/7] relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/banner-hero.jpg";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      Live Preview: {formData.title || "Banner Preview"}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0C831F] focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="activeToggle" className="font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Activate banner immediately on storefront
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0C831F] hover:bg-[#096618] text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  {currentBanner ? "Update Banner" : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
