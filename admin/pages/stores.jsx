import { useEffect, useState } from "react";

const API = "";

export default function StoresAdmin() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
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
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const url = filterCity
        ? `${API}/api/stores?city=${encodeURIComponent(filterCity)}`
        : `${API}/api/stores`;
      const res = await fetch(url);
      if (res.ok) setStores(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filterCity]);

  function openNew() {
    setEditId(null);
    setForm({
      name: "",
      code: `STORE-${Date.now().toString().slice(-4)}`,
      city: "Hamirpur",
      area: "",
      address: "",
      pincode: "",
      phone: "",
      isActive: true,
    });
    setShowModal(true);
  }

  function openEdit(s) {
    setEditId(s._id);
    setForm({
      name: s.name,
      code: s.code,
      city: s.city,
      area: s.area,
      address: s.address || "",
      pincode: s.pincode || "",
      phone: s.phone || "",
      isActive: s.isActive !== false,
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

    const url = editId ? `${API}/api/stores/${editId}` : `${API}/api/stores`;
    const method = editId ? "PUT" : "POST";

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
        alert(data.message || "Failed to save store");
      }
    } catch {
      alert("Network error saving store");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Are you sure you want to delete store "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/stores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) load();
    } catch {}
  }

  const cities = Array.from(new Set(stores.map((s) => s.city).filter(Boolean)));
  
  const filteredStores = stores.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.pincode && s.pincode.includes(searchQuery));
    return matchesSearch;
  });

  const activeStoresCount = stores.filter((s) => s.isActive !== false).length;

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
                  Dark Stores & Warehouses
                </h1>
                <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                  Hamirpur Hub • Single Branch
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Exclusive single fulfillment store hub for Hamirpur District (Gandhi Chowk), serving all local catchments
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0C831F] hover:bg-[#0a731b] text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Dark Store
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Active Hubs
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              {activeStoresCount} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">/ {stores.length}</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Ready for dispatch
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
            🏬
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Covered Cities
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              {cities.length}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Metro & Tier-1 coverage
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
            🏙️
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Avg SLA Dispatch
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-outfit">
              8.4 min
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
              Store to rider handoff
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-md shadow-purple-500/20">
            ⚡
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              Network Health
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-outfit flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              99.8%
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
              All dark stores online
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md shadow-amber-500/20">
            📶
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-600 dark:text-gray-400 mr-1">
            City:
          </span>
          <button
            onClick={() => setFilterCity("")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !filterCity
                ? "bg-[#0C831F] text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All Cities ({stores.length})
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterCity === city
                  ? "bg-[#0C831F] text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hub name, code, pin..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
          />
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stores Table */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 dark:bg-[#161c27] text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-5">Store Hub Code</th>
                <th className="py-3.5 px-5">Store Facility Name</th>
                <th className="py-3.5 px-5">City Zone</th>
                <th className="py-3.5 px-5">Fulfillment Catchment</th>
                <th className="py-3.5 px-5">Hotline Contact</th>
                <th className="py-3.5 px-5">Hub Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 dark:text-gray-400 font-medium">
                    No dark stores match your filter.
                  </td>
                </tr>
              ) : (
                filteredStores.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/60 dark:hover:bg-[#1a1f2c]/50 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                        {s.code}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-gray-900 dark:text-white">{s.name}</div>
                      {s.address && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-xs mt-0.5">
                          {s.address}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                        {s.city}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{s.area}</div>
                      {s.pincode && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                          PIN: {s.pincode}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                      {s.phone || "—"}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        {s.isActive ? "Online" : "Paused"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1.5">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                        title="Edit Dark Store"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
                        title="Delete Dark Store"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white font-outfit">
                  {editId ? "Edit Dark Store" : "Create New Dark Store Hub"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Configure dispatch radius, zone routing and hotline details
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center font-bold text-sm transition-colors"
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
                  placeholder="e.g. Zippin Dark Store #101 - Cyber Hub"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Store Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STORE-GGN-101"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white font-mono uppercase text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    City Zone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamirpur"
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
                    placeholder="e.g. DLF Cyber City"
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
                    placeholder="e.g. 122002"
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
                  placeholder="e.g. Building 10B, DLF Cyber Hub, Sector 24"
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
                    placeholder="e.g. 0124-4112233"
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
                      Hub is Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0C831F] hover:bg-[#0a731b] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Update Store" : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
