import { useEffect, useState } from "react";

const API = "";

const STATUS_CONFIG = {
  available: {
    bg: "bg-green-100",
    text: "text-green-700",
    dot: "bg-green-500",
    label: "Available",
  },
  busy: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
    label: "On Delivery",
  },
  offline: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: "Offline",
  },
};

export default function DeliveryPartnersAdmin() {
  const [partners, setPartners] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
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
      if (filterStatus) params.set("status", filterStatus);
      if (filterCity) params.set("city", filterCity);

      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/api/delivery-partners?${params.toString()}`),
        fetch(`${API}/api/stores`),
      ]);

      if (pRes.ok) setPartners(await pRes.json());
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

  function openEdit(p) {
    setEditId(p._id);
    setForm({
      firstName: p.firstName || (p.name ? p.name.split(" ")[0] : ""),
      lastName: p.lastName || (p.name ? p.name.split(" ").slice(1).join(" ") : ""),
      phone: p.phone,
      email: p.email || "",
      city: p.city,
      status: p.status || "available",
      vehicleType: p.vehicleType || "Bike",
      vehicleNumber: p.vehicleNumber || "",
      currentStore: p.currentStore?._id || p.currentStore || "",
    });
    setShowModal(true);
  }

  async function handleStatusChange(partnerId, newStatus) {
    try {
      const res = await fetch(`${API}/api/delivery-partners/${partnerId}/status`, {
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

  async function handleSave() {
    if (!form.firstName || !form.phone || !form.city) {
      alert("First Name, Phone, and City are required.");
      return;
    }

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
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        load();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to save partner");
      }
    } catch {
      alert("Network error");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to remove this delivery partner?")) return;
    try {
      const res = await fetch(`${API}/api/delivery-partners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) load();
    } catch {}
  }

  const cities = Array.from(new Set(partners.map((p) => p.city).filter(Boolean)));

  if (loading) {
    return <div className="h-64 bg-white rounded-xl animate-pulse" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🛵</span> Delivery Fleet & Partners
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage 10-minute instant delivery fleet and real-time status (DBMS ER Model: delivery_partner)
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-admin-green hover:bg-admin-green-dark text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>+</span> Add Delivery Partner
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status:
          </span>
          {["", "available", "busy", "offline"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                filterStatus === st
                  ? "bg-admin-green text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st || "All"}
            </button>
          ))}
        </div>

        {cities.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              City:
            </span>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="text-xs border rounded-lg px-2.5 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-admin-green"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-3 px-4">Partner Name</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Assigned Dark Store</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Performance</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No delivery partners found. Click &quot;Add Delivery Partner&quot; to onboard.
                  </td>
                </tr>
              ) : (
                partners.map((p) => {
                  const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.available;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-admin-green/10 text-admin-green font-bold text-xs flex items-center justify-center">
                            {p.firstName?.[0] || "P"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {p.name || `${p.firstName} ${p.lastName || ""}`.trim()}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              ID: {p._id.slice(-6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-700">
                        {p.phone}
                        {p.email && (
                          <p className="font-sans text-[11px] text-gray-400">
                            {p.email}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                          {p.city}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {p.currentStore?.name ? (
                          <span className="font-medium text-gray-800">
                            {p.currentStore.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-700">
                        <span className="font-medium">{p.vehicleType || "Bike"}</span>
                        {p.vehicleNumber && (
                          <p className="text-[10px] font-mono text-gray-400">
                            {p.vehicleNumber}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="flex items-center gap-1 font-semibold text-amber-600">
                          <span>⭐</span> {p.rating || 4.8}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {p.totalDeliveries || 0} drops
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                          <select
                            value={p.status}
                            onChange={(e) => handleStatusChange(p._id, e.target.value)}
                            className="text-[11px] border rounded px-1.5 py-0.5 text-gray-600 bg-white"
                          >
                            <option value="available">Available</option>
                            <option value="busy">Busy</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editId ? "Edit Delivery Partner" : "Onboard Delivery Partner"}
            </h2>
            <div className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yadav"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Operating City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gurugram"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  >
                    <option value="Bike">Petrol Bike</option>
                    <option value="EV Scooter">EV Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Van">Delivery Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Vehicle Registration No.
                  </label>
                  <input
                    type="text"
                    placeholder="HR-26-BR-1234"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green font-mono uppercase text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Assigned Dark Store
                  </label>
                  <select
                    value={form.currentStore}
                    onChange={(e) => setForm({ ...form, currentStore: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  >
                    <option value="">Unassigned</option>
                    {stores.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-admin-green hover:bg-admin-green-dark text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                {editId ? "Update Partner" : "Onboard Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
