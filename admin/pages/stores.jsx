import { useEffect, useState } from "react";

const API = "";

export default function StoresAdmin() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    city: "Hamirpur",
    area: "",
    address: "",
    pincode: "",
    phone: "",
    isActive: true,
    surgeMultiplier: 1.0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const res = await fetch(`${API}/api/stores`);
      if (res.ok) {
        const data = await res.json();
        setStores(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const store = stores[0] || {
    code: "STR-HMR-501",
    name: "Zippin Store #501 - Hamirpur Hub",
    city: "Hamirpur",
    area: "Hamirpur District Center",
    address: "Main Bazaar, Near Gandhi Chowk, Hamirpur, HP - 177001",
    pincode: "177001",
    phone: "+91 98110 09911",
    isActive: true,
    deliveryRadiusKm: 8.0,
    surgeMultiplier: 1.0,
  };

  function openEdit(s) {
    const target = s || store;
    setForm({
      name: target.name || "",
      code: target.code || "STR-HMR-501",
      city: target.city || "Hamirpur",
      area: target.area || "Hamirpur District Center",
      address: target.address || "",
      pincode: target.pincode || "177001",
      phone: target.phone || "+91 98110 09911",
      isActive: target.isActive !== false,
      surgeMultiplier: target.surgeMultiplier || 1.0,
    });
    setShowModal(true);
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    if (!form.name || !form.code || !form.city || !form.area) {
      alert("Name, Code, City, and Area are required.");
      return;
    }
    setSaving(true);

    const storeId = store._id;
    const url = storeId ? `${API}/api/stores/${storeId}` : `${API}/api/stores`;
    const method = storeId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        load();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update store");
      }
    } catch {
      alert("Network error updating store");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white dark:bg-[#121212] rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#121212] rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-white dark:bg-[#121212] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-gray-900 dark:text-white font-outfit">
                  Store Facility & Operations
                </h1>
                <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  Hamirpur Hub • Single Exclusive Store
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Primary physical fulfillment store facility for Hamirpur District (Gandhi Chowk), serving all local catchments
              </p>
            </div>
          </div>
        </div>

        {/* Action: Edit Store Information */}
        <button
          onClick={() => openEdit(store)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0C831F] hover:bg-[#0a731b] text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Store Details
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Branch Card */}
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Store Branch
            </div>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              Hamirpur Hub
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Code: {store.code} • Ready
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
            🏬
          </div>
        </div>

        {/* Coverage Card */}
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Service Catchment
            </div>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              Hamirpur District
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Gandhi Chowk (PIN: 177001)
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
            📍
          </div>
        </div>

        {/* SLA Card */}
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Dispatch SLA
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-outfit">
              8-10 min
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
              Store to rider handoff
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-md shadow-purple-500/20">
            ⚡
          </div>
        </div>

        {/* Store Status Card (with Surge Pricing indicator) */}
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Store Status & Surge
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-outfit flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {store.isActive ? "Operational" : "Temporarily Paused"}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
              Surge pricing: {store.surgeMultiplier ? `${store.surgeMultiplier}x` : "1.0x (Normal)"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md shadow-amber-500/20">
            📶
          </div>
        </div>
      </div>

      {/* Single Store Facility Comprehensive Profile Card */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-3xl">
              🏬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 dark:text-white">
                  {store.name}
                </h2>
                <span className="font-mono text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-lg border border-gray-200 dark:border-gray-700">
                  {store.code}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Sole operating branch serving all deliveries across Hamirpur District
              </p>
            </div>
          </div>

          <button
            onClick={() => openEdit(store)}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>✏️</span>
            <span>Update Store Settings</span>
          </button>
        </div>

        {/* Detailed Grid of Facility Properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              📍 Physical Location
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">
              {store.address || "Main Bazaar, Near Gandhi Chowk"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Hamirpur, Himachal Pradesh - {store.pincode || "177001"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              📞 Hotline & Contact
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white font-mono">
              {store.phone || "+91 98110 09911"}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
              Live customer support line
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              ⏰ Operating Schedule
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">
              6:00 AM – 11:30 PM
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Open 7 days a week (All year round)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              🌐 Geofenced Delivery Radius
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">
              {store.deliveryRadiusKm || 8.0} km
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Origin: Gandhi Chowk Hub (31.6862° N, 76.5213° E)
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              🛵 Active Delivery Fleet
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">
              10 Delivery Riders Assigned
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-semibold">
              Dedicated Hamirpur EV & Bike fleet
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-[#161c27] border border-gray-100 dark:border-gray-800">
            <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              📦 In-Store Assembly
            </div>
            <div className="text-sm font-black text-gray-900 dark:text-white">
              6 Dedicated Pickers
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5 font-semibold">
              82-second average pick speed SLA
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog for Editing Store Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white font-outfit">
                  Edit Store Facility Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Update primary store address, hotline contact, and operational status
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Store Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zippin Store #501 - Hamirpur Hub"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Store Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value={form.code}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 font-mono uppercase text-xs cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    City Zone *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Catchment Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-gray-50 dark:bg-[#1a1f2c] rounded-xl border border-gray-200 dark:border-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#0C831F] rounded focus:ring-[#0C831F]"
                    />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Store is Active & Open
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0C831F] hover:bg-[#0a731b] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Update Store Information"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
