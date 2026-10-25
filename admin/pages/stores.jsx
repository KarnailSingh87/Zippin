import { useEffect, useState } from "react";

const API = "";

export default function StoresAdmin() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    city: "Gurugram",
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
      city: "Gurugram",
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

  async function handleSave() {
    if (!form.name || !form.code || !form.city || !form.area) {
      alert("Name, Code, City, and Area are required.");
      return;
    }

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
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this store?")) return;
    try {
      const res = await fetch(`${API}/api/stores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) load();
    } catch {}
  }

  const cities = Array.from(new Set(stores.map((s) => s.city).filter(Boolean)));

  if (loading) {
    return <div className="h-64 bg-white rounded-xl animate-pulse" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏬</span> Dark Stores & Warehouses
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage hyperlocal fulfillment hubs across cities (DBMS ER Model: store)
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-admin-green hover:bg-admin-green-dark text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>+</span> Add Dark Store
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Filter by City:
        </span>
        <button
          onClick={() => setFilterCity("")}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
            !filterCity
              ? "bg-admin-green text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Cities ({stores.length})
        </button>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setFilterCity(city)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterCity === city
                ? "bg-admin-green text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-3 px-4">Store Code</th>
                <th className="py-3 px-4">Store Name</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Fulfillment Area</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
                    No dark stores found. Click &quot;Add Dark Store&quot; to create one.
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-bold text-gray-700">
                      {s.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                        {s.city}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <p className="font-medium text-gray-800">{s.area}</p>
                      {s.pincode && (
                        <p className="text-xs text-gray-400">PIN: {s.pincode}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {s.phone || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          s.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
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
              {editId ? "Edit Dark Store" : "Create New Dark Store"}
            </h2>
            <div className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zippin Dark Store #101 - Cyber Hub"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Store Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STORE-GGN-101"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green font-mono uppercase text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    City *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Fulfillment Area *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DLF Cyber City"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 122002"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Building 10B, DLF Cyber Hub, Sector 24"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0124-4112233"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-green text-sm"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-admin-green rounded"
                    />
                    <span className="text-xs font-semibold text-gray-700">
                      Store is Active
                    </span>
                  </label>
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
                {editId ? "Update Store" : "Create Store"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
