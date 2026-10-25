import { useEffect, useState } from "react";

const API = "";

const STATUS_CONFIG = {
  available: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Available",
  },
  busy: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "On Delivery",
  },
  offline: {
    bg: "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
    label: "Offline",
  },
};

export default function DeliveryRidersAdmin() {
  const [riders, setRiders] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "Gurugram",
    status: "available",
    vehicleType: "Bike",
    vehicleNumber: "",
    currentStore: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const params = new URLSearchParams();
      params.set("role", "rider");
      if (filterStatus) params.set("status", filterStatus);
      if (filterCity) params.set("city", filterCity);

      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/api/delivery-partners?${params.toString()}`),
        fetch(`${API}/api/stores`),
      ]);

      if (pRes.ok) setRiders(await pRes.json());
      if (sRes.ok) setStores(await sRes.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filterStatus, filterCity]);

  function openNew() {
    setEditId(null);
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      city: "Gurugram",
      status: "available",
      vehicleType: "Bike",
      vehicleNumber: "",
      currentStore: stores[0]?._id || "",
    });
    setShowModal(true);
  }

  function openEdit(r) {
    setEditId(r._id);
    setForm({
      firstName: r.firstName || (r.name ? r.name.split(" ")[0] : ""),
      lastName: r.lastName || (r.name ? r.name.split(" ").slice(1).join(" ") : ""),
      phone: r.phone,
      email: r.email || "",
      city: r.city,
      status: r.status || "available",
      vehicleType: r.vehicleType || "Bike",
      vehicleNumber: r.vehicleNumber || "",
      currentStore: r.currentStore?._id || r.currentStore || "",
    });
    setShowModal(true);
  }

  async function handleStatusChange(riderId, newStatus) {
    try {
      const res = await fetch(`${API}/api/delivery-partners/${riderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) load();
    } catch {}
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    if (!form.firstName || !form.phone || !form.city) {
      alert("First Name, Phone, and City are required.");
      return;
    }
    setSaving(true);

    const url = editId
      ? `${API}/api/delivery-partners/${editId}`
      : `${API}/api/delivery-partners`;
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, role: "rider" }),
      });

      if (res.ok) {
        setShowModal(false);
        load();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save rider");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Are you sure you want to remove delivery rider "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/api/delivery-partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) load();
    } catch {}
  }

  const cities = Array.from(new Set(riders.map((r) => r.city).filter(Boolean)));

  const filteredRiders = riders.filter((r) => {
    const fullName = r.name || `${r.firstName || ""} ${r.lastName || ""}`;
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone?.includes(searchQuery) ||
      (r.vehicleNumber && r.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const availableCount = riders.filter((r) => r.status === "available").length;
  const busyCount = riders.filter((r) => r.status === "busy").length;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white dark:bg-[#121212] rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <span className="text-xl">🛵</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white font-outfit">
                Delivery Fleet & Riders
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage 10-minute quick-commerce delivery riders, transit status & dark store allocation
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
          Onboard Delivery Rider
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total Fleet Riders
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              {riders.length}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Active registered riders
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
            🛵
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Available at Hubs
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-outfit flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {availableCount}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Waiting for order handoff
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
            🟢
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              On Active Delivery
            </div>
            <div className="text-2xl font-black text-amber-500 mt-1 font-outfit flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              {busyCount}
            </div>
            <div className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
              Transit SLA in progress
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md shadow-amber-500/20">
            ⚡
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Fleet CSAT Rating
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-outfit">
              4.92 ⭐
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Top 1% fast delivery SLA
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-md shadow-purple-500/20">
            🏆
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
            Status:
          </span>
          {[
            { id: "", label: "All Riders" },
            { id: "available", label: "Available" },
            { id: "busy", label: "On Delivery" },
            { id: "offline", label: "Offline" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st.id
                  ? "bg-[#0C831F] text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* City Filter & Search Input */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {cities.length > 0 && (
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="text-xs bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
            >
              <option value="">All Operating Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rider name, phone..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 dark:bg-[#161c27] text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-5">Rider Partner</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">City Hub</th>
                <th className="py-3.5 px-5">Assigned Dark Store</th>
                <th className="py-3.5 px-5">Vehicle Specs</th>
                <th className="py-3.5 px-5">Delivery Stats</th>
                <th className="py-3.5 px-5">Fleet Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">
                    No delivery riders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((r) => {
                  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.available;
                  const displayName = r.name || `${r.firstName || ""} ${r.lastName || ""}`.trim();
                  return (
                    <tr key={r._id} className="hover:bg-gray-50/60 dark:hover:bg-[#1a1f2c]/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-[#0C831F] dark:text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/20">
                            {r.firstName?.[0] || displayName[0] || "R"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {displayName}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              ID: {r._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono text-gray-800 dark:text-gray-200">
                        {r.phone}
                        {r.email && (
                          <p className="font-sans text-[11px] text-gray-400 truncate max-w-xs">
                            {r.email}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                          {r.city}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 dark:text-gray-300">
                        {r.currentStore?.name ? (
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {r.currentStore.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">Global Pool</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {r.vehicleType || "Bike"}
                        </span>
                        {r.vehicleNumber && (
                          <p className="text-[10px] font-mono text-gray-400 uppercase">
                            {r.vehicleNumber}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <span>⭐</span> {r.rating || 4.8}
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {r.totalDeliveries || 142} deliveries
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r._id, e.target.value)}
                            className="text-[11px] font-medium border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1a1f2c] focus:outline-none"
                          >
                            <option value="available">Available</option>
                            <option value="busy">Busy (On Delivery)</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right space-x-1.5">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                          title="Edit Rider"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(r._id, displayName)}
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
                          title="Remove Rider"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white font-outfit">
                  {editId ? "Edit Delivery Rider" : "Onboard Delivery Rider"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Rider credential verification and dark store assignment
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yadav"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Phone (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Operating City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gurugram"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  >
                    <option value="Bike">Petrol Bike</option>
                    <option value="EV Scooter">EV Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Van">Delivery Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Vehicle Reg. No.
                  </label>
                  <input
                    type="text"
                    placeholder="HR-26-BR-1234"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white font-mono uppercase text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Assigned Dark Store
                  </label>
                  <select
                    value={form.currentStore}
                    onChange={(e) => setForm({ ...form, currentStore: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  >
                    <option value="">Unassigned (Global Pool)</option>
                    {stores.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy (On Delivery)</option>
                    <option value="offline">Offline</option>
                  </select>
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
                  {saving ? "Saving..." : editId ? "Update Rider" : "Onboard Rider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
