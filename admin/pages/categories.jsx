import { useEffect, useState } from "react";

const API = "";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "",
    color: "#f0f0f0",
    sortOrder: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const res = await fetch(`${API}/api/categories`);
      if (res.ok) setCategories(await res.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditId(null);
    setForm({ name: "", slug: "", icon: "", color: "#f0f0f0", sortOrder: "" });
    setShowModal(true);
  }

  function openEdit(c) {
    setEditId(c._id);
    setForm({
      name: c.name,
      slug: c.slug,
      icon: c.icon || "",
      color: c.color || "#f0f0f0",
      sortOrder: String(c.sortOrder || ""),
    });
    setShowModal(true);
  }

  async function handleSave() {
    const body = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sortOrder: Number(form.sortOrder) || 0,
    };
    const url = editId
      ? `${API}/api/categories/${editId}`
      : `${API}/api/categories`;
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    setShowModal(false);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    await fetch(`${API}/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  if (loading)
    return <div className="h-64 bg-white rounded-xl animate-pulse" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{categories.length} categories</p>
        <button
          onClick={openNew}
          className="bg-admin-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-admin-green-dark transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: c.color || "#f0f0f0" }}
            >
              {c.icon || "📦"}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">{c.name}</h3>
              <p className="text-xs text-gray-400">/{c.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(c)}
                className="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="text-xs text-red-500 hover:underline"
              >
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Slug
                </label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated"
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Icon (emoji)
                  </label>
                  <input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="🥬"
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-admin-green text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-admin-green-dark"
              >
                {editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
