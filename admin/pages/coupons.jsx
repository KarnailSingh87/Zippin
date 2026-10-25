import { useState } from "react";
import Head from "next/head";

const INITIAL_COUPONS = [
  {
    _id: "c1",
    code: "WELCOME50",
    discountType: "percentage",
    discountValue: 50,
    minOrderValue: 199,
    maxDiscount: 100,
    expiresAt: "2026-12-31",
    usageLimitPerUser: 1,
    totalUsageLimit: 10000,
    usedCount: 1420,
    isActive: true,
    description: "50% OFF up to ₹100 on first 3 grocery orders",
  },
  {
    _id: "c2",
    code: "ZIPPIN50",
    discountType: "percentage",
    discountValue: 50,
    minOrderValue: 249,
    maxDiscount: 75,
    expiresAt: "2026-11-30",
    usageLimitPerUser: 2,
    totalUsageLimit: 5000,
    usedCount: 2310,
    isActive: true,
    description: "Instant 50% discount for lightning delivery",
  },
  {
    _id: "c3",
    code: "SAVE20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 149,
    maxDiscount: 50,
    expiresAt: "2026-10-31",
    usageLimitPerUser: 5,
    totalUsageLimit: 20000,
    usedCount: 8940,
    isActive: true,
    description: "Flat 20% savings on daily fresh dairy & veggies",
  },
  {
    _id: "c4",
    code: "FREEDEL",
    discountType: "flat",
    discountValue: 25,
    minOrderValue: 99,
    maxDiscount: 25,
    expiresAt: "2026-12-15",
    usageLimitPerUser: 10,
    totalUsageLimit: 15000,
    usedCount: 6512,
    isActive: false,
    description: "Zero delivery fee on midnight snack cravings",
  },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 199,
    maxDiscount: 100,
    expiresAt: "2026-12-31",
    usageLimitPerUser: 1,
    totalUsageLimit: 5000,
    description: "",
    isActive: true,
  });

  function openCreate() {
    setEditId(null);
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: 20,
      minOrderValue: 199,
      maxDiscount: 100,
      expiresAt: "2026-12-31",
      usageLimitPerUser: 1,
      totalUsageLimit: 5000,
      description: "",
      isActive: true,
    });
    setShowModal(true);
  }

  function openEdit(c) {
    setEditId(c._id);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscount: c.maxDiscount,
      expiresAt: c.expiresAt,
      usageLimitPerUser: c.usageLimitPerUser,
      totalUsageLimit: c.totalUsageLimit,
      description: c.description,
      isActive: c.isActive,
    });
    setShowModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (editId) {
      setCoupons((prev) =>
        prev.map((c) => (c._id === editId ? { ...c, ...form } : c))
      );
    } else {
      const newCoupon = {
        _id: "c_" + Date.now(),
        ...form,
        usedCount: 0,
      };
      setCoupons([newCoupon, ...coupons]);
    }
    setShowModal(false);
  }

  function toggleActive(id) {
    setCoupons((prev) =>
      prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c))
    );
  }

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    }
  }

  const filteredCoupons = coupons.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q));
    const matchesStatus =
      filterActive === "all"
        ? true
        : filterActive === "active"
        ? c.isActive
        : !c.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Head>
        <title>Promotions & Coupon Codes | Zippin Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Promotions & Coupons Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0C831F] dark:text-emerald-400 text-xs font-bold">
              {coupons.filter((c) => c.isActive).length} Active Offers
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create promotional discount codes, manage redemption limits, and launch flash campaigns
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0C831F] hover:bg-[#0a731b] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create New Coupon
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
          />
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xs text-gray-800 dark:text-gray-200"
        >
          <option value="all">All Coupons</option>
          <option value="active">Active Only</option>
          <option value="inactive">Expired / Inactive</option>
        </select>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className={`p-5 rounded-2xl border transition-all ${
              coupon.isActive
                ? "bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800 shadow-sm"
                : "bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800/60 opacity-75"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm tracking-widest border border-emerald-200 dark:border-emerald-800/60">
                  {coupon.code}
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  {coupon.description}
                </p>
              </div>
              <button
                onClick={() => toggleActive(coupon._id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  coupon.isActive
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {coupon.isActive ? "Active" : "Disabled"}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Benefit</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Min Order</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{coupon.minOrderValue}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Max Cap</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{coupon.maxDiscount}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Redemptions</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {coupon.usedCount} / {coupon.totalUsageLimit}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Expires {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(coupon)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c27] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-black text-gray-900 dark:text-white">
              {editId ? "Edit Promotion Coupon" : "Create New Coupon Code"}
            </h3>
            <form onSubmit={handleSave} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MONSOON30"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white uppercase font-mono font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Value</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Flat 30% discount on vegetables"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl text-xs font-bold bg-[#0C831F] text-white hover:bg-[#0a731b]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
