import { useEffect, useState, useMemo } from "react";
import Head from "next/head";

const API = "";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    mrp: "",
    unit: "",
    stock: "",
    category: "",
    storeId: "",
    description: "",
    isFeatured: false,
    isAvailable: true,
    discount: "",
    tags: "",
    imageUrl: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes, storeRes] = await Promise.all([
        fetch(`${API}/api/products?all=true&limit=1000`),
        fetch(`${API}/api/categories`),
        fetch(`${API}/api/stores`),
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) setCategories(await catRes.json());
      if (storeRes.ok) setStores(await storeRes.json());
    } catch (err) {
      console.error("Failed to load products:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))) ||
        (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()));

      // Category filter
      const catId = p.category?._id || p.category;
      const matchesCategory =
        selectedCategory === "all" || catId === selectedCategory;

      // Stock filter
      let matchesStock = true;
      const stock = p.stock || 0;
      if (stockFilter === "in_stock") matchesStock = stock > 10;
      else if (stockFilter === "low_stock") matchesStock = stock > 0 && stock <= 10;
      else if (stockFilter === "out_of_stock") matchesStock = stock === 0;

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = p.isAvailable === true;
      else if (statusFilter === "inactive") matchesStatus = p.isAvailable === false;
      else if (statusFilter === "featured") matchesStatus = p.isFeatured === true;

      return matchesSearch && matchesCategory && matchesStock && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock_asc") return (a.stock || 0) - (b.stock || 0);
      if (sortBy === "stock_desc") return (b.stock || 0) - (a.stock || 0);
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [products, search, selectedCategory, stockFilter, statusFilter, sortBy]);

  // Pagination slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  // Stats KPI counters
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isAvailable !== false).length;
    const lowStock = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
    const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;
    const featured = products.filter((p) => p.isFeatured).length;
    return { total, active, lowStock, outOfStock, featured };
  }, [products]);

  // Modal open helpers
  function openNew() {
    setEditId(null);
    setForm({
      title: "",
      slug: "",
      price: "",
      mrp: "",
      unit: "1 unit",
      stock: "50",
      category: categories[0]?._id || "",
      storeId: stores[0]?._id || "",
      description: "",
      isFeatured: false,
      isAvailable: true,
      discount: "0",
      tags: "groceries, fresh",
      imageUrl: "",
    });
    setShowModal(true);
  }

  function openEdit(p) {
    setEditId(p._id);
    const catId = p.category?._id || p.category || "";
    const storeId = p.storeId?._id || p.storeId || "";
    setForm({
      title: p.title || "",
      slug: p.slug || "",
      price: String(p.price || 0),
      mrp: String(p.mrp || p.price || 0),
      unit: p.unit || "",
      stock: String(p.stock || 0),
      category: catId,
      storeId: storeId,
      description: p.description || "",
      isFeatured: !!p.isFeatured,
      isAvailable: p.isAvailable !== false,
      discount: String(p.discount || 0),
      tags: (p.tags || []).join(", "),
      imageUrl: p.images?.[0]?.url || "",
    });
    setShowModal(true);
  }

  // Quick Inline Toggle Availability
  async function toggleAvailability(id, e) {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/api/products/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((item) => (item._id === id ? { ...item, isAvailable: updated.isAvailable } : item))
        );
        showToast(`Product ${updated.isAvailable ? "activated" : "deactivated"}`);
      }
    } catch {
      showToast("Failed to update status");
    }
  }

  // Quick Inline Stock increment / decrement
  async function adjustStock(id, currentStock, delta, e) {
    e.stopPropagation();
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`${API}/api/products/${id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item._id === id ? { ...item, stock: newStock } : item))
        );
      }
    } catch {}
  }

  // Save product in modal
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const priceNum = Number(form.price);
    const mrpNum = Number(form.mrp) || priceNum;
    const calcDiscount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: priceNum,
      mrp: mrpNum,
      discount: calcDiscount,
      unit: form.unit.trim(),
      stock: Number(form.stock) || 0,
      category: form.category || undefined,
      storeId: form.storeId || undefined,
      description: form.description.trim(),
      isFeatured: form.isFeatured,
      isAvailable: form.isAvailable,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: [
        {
          url:
            form.imageUrl.trim() ||
            `https://placehold.co/400x400/F4F6FB/111?text=${encodeURIComponent(
              form.title.split(" ")[0]
            )}`,
          publicId: "",
        },
      ],
    };

    try {
      const url = editId ? `${API}/api/products/${editId}` : `${API}/api/products`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editId ? "Product updated successfully!" : "New product created!");
        setShowModal(false);
        loadData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save product");
      }
    } catch {
      alert("Error communicating with server");
    }
    setSaving(false);
  }

  // Delete product
  async function handleDelete(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {
      showToast("Error deleting product");
    }
  }

  // Bulk operations
  async function handleBulkAction(action) {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`Delete all ${selectedIds.length} selected products?`)) return;

    try {
      const res = await fetch(`${API}/api/products/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (res.ok) {
        showToast(`Bulk ${action} executed for ${selectedIds.length} products`);
        setSelectedIds([]);
        loadData();
      }
    } catch {
      showToast("Failed to run bulk action");
    }
  }

  // Selection toggle
  function toggleSelectAll() {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p._id));
    }
  }

  function toggleSelectOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Export to CSV
  function exportCSV() {
    const headers = ["SKU_ID", "Title", "Category", "Price", "MRP", "Stock", "Status", "Unit"];
    const rows = filteredProducts.map((p) => [
      p._id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category?.name || "General"}"`,
      p.price,
      p.mrp || p.price,
      p.stock || 0,
      p.isAvailable ? "Active" : "Inactive",
      `"${p.unit || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `zippin_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Import from CSV
  async function handleImportCSV(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (!text) return;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length <= 1) return alert("CSV file is empty or only has headers");
        const token = localStorage.getItem("admin_token");
        let imported = 0;
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
          if (cols.length >= 4) {
            const title = cols[1] || cols[0];
            const price = Number(cols[3]) || Number(cols[1]) || 50;
            const mrp = Number(cols[4]) || price;
            const stock = Number(cols[5]) || 20;
            const unit = cols[7] || "1 pc";
            await fetch(`${API}/api/products`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title, price, mrp, stock, unit, isAvailable: true }),
            });
            imported++;
          }
        }
        alert(`Successfully imported ${imported} products via CSV!`);
        loadProducts();
      } catch (err) {
        alert("Failed to import CSV: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-5">
      <Head>
        <title>Products Management | Zippin Admin</title>
      </Head>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {toastMessage}
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Catalog Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage live pricing, inventory allocations, and availability across dark stores
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer">
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0C831F] hover:bg-[#0a731b] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-900/20 active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total SKUs</div>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
            📦
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Active for Sale</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            ✓
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Low Stock (≤10)</div>
            <div className="text-xl font-black text-amber-500 dark:text-amber-400 mt-1">{stats.lowStock}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
            ⚠️
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between transition-colors">
          <div>
            <div className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Out of Stock</div>
            <div className="text-xl font-black text-rose-500 dark:text-rose-400 mt-1">{stats.outOfStock}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
            ✕
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between col-span-2 md:col-span-1 transition-colors">
          <div>
            <div className="text-[11px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Featured</div>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">{stats.featured}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
            ⭐
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, SKU, or tags..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0C831F] transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-xl text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0C831F]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-2">
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-xl text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0C831F]"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock (&gt;10)</option>
              <option value="low_stock">Low Stock (1-10)</option>
              <option value="out_of_stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-xl text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-[#0C831F]"
            >
              <option value="all">All Availability</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured ⭐</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="md:col-span-1 flex items-center gap-1 justify-end">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg border text-xs cursor-pointer ${
                viewMode === "table"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              title="Table View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg border text-xs cursor-pointer ${
                viewMode === "grid"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white"
                  : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              title="Grid View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Selected Batch Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-fade-in">
            <span className="font-semibold text-emerald-900">
              {selectedIds.length} product(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("activate")}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkAction("deactivate")}
                className="px-2.5 py-1 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Set Inactive
              </button>
              <button
                onClick={() => handleBulkAction("feature")}
                className="px-2.5 py-1 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Feature ⭐
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="text-gray-500 hover:text-gray-800 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Listing View (Table or Grid) */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#0C831F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading catalog items from Zippin network...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-bold text-gray-800 text-sm">No products found</h3>
          <p className="text-xs text-gray-400 mt-1">Try resetting your search query or filters.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setStockFilter("all");
              setStatusFilter("all");
            }}
            className="mt-3 text-xs text-[#0C831F] font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0c1017] border-b border-gray-100 dark:border-gray-800 text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        selectedIds.length === paginatedProducts.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#0C831F] focus:ring-[#0C831F]"
                    />
                  </th>
                  <th className="p-3.5">Product & SKU</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price & MRP</th>
                  <th className="p-3.5">Stock Level</th>
                  <th className="p-3.5 text-center">Availability</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p._id);
                  const isLow = (p.stock || 0) <= 10 && (p.stock || 0) > 0;
                  const isOut = (p.stock || 0) === 0;

                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors ${
                        isSelected ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(p._id)}
                          className="rounded border-gray-300 text-[#0C831F] focus:ring-[#0C831F]"
                        />
                      </td>

                      {/* Product Thumbnail & Details */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden flex items-center justify-center shrink-0 p-1">
                            {p.images?.[0]?.url ? (
                              <img
                                src={p.images[0].url}
                                alt={p.title}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-base font-bold text-gray-500 dark:text-gray-400">
                                {p.title.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs text-xs">
                                {p.title}
                              </span>
                              {p.isFeatured && (
                                <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold px-1.5 py-0.2 rounded">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                              <span className="font-mono text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium">
                                SKU-{p._id.slice(-4).toUpperCase()}
                              </span>
                              <span>•</span>
                              <span>{p.unit || "Standard"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-300 text-[11px]">
                          {p.category?.name || "General"}
                        </span>
                      </td>

                      {/* Price & MRP */}
                      <td className="p-3.5">
                        <div className="font-bold text-gray-900 dark:text-white text-xs">₹{p.price}</div>
                        {p.mrp > p.price && (
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="line-through text-gray-400 dark:text-gray-500">₹{p.mrp}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Stock Level with inline adjust */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => adjustStock(p._id, p.stock || 0, -1, e)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs"
                            title="Decrease 1"
                          >
                            -
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[11px] min-w-[36px] text-center ${
                              isOut
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                                : isLow
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            }`}
                          >
                            {p.stock || 0}
                          </span>
                          <button
                            onClick={(e) => adjustStock(p._id, p.stock || 0, 5, e)}
                            className="w-5 h-5 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center font-bold text-xs"
                            title="Add 5"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Live Toggle Switch */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={(e) => toggleAvailability(p._id, e)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            p.isAvailable ? "bg-[#0C831F]" : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              p.isAvailable ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Edit Product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(p._id, p.title)}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Product"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-gray-50 dark:bg-[#1a1f2c] rounded-xl overflow-hidden mb-2 relative flex items-center justify-center p-2">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-gray-300 dark:text-gray-600">{p.title.charAt(0)}</span>
                  )}
                  {p.isFeatured && (
                    <span className="absolute top-2 left-2 text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded shadow">
                      ⭐ Featured
                    </span>
                  )}
                  <span
                    className={`absolute bottom-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                      p.isAvailable ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    }`}
                  >
                    {p.isAvailable ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400 font-extrabold uppercase">
                  {p.category?.name || "General"}
                </div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate mt-0.5">{p.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{p.unit}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <div className="font-black text-gray-900 dark:text-emerald-400 text-xs">₹{p.price}</div>
                  {p.mrp > p.price && (
                    <div className="text-[10px] text-gray-400 dark:text-gray-500 line-through">₹{p.mrp}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 shadow-sm">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 focus:outline-none"
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
          <span className="text-gray-400 dark:text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length} items
          </span>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 bg-[#0C831F] text-white rounded-lg font-bold text-xs shadow-sm">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Comprehensive Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white font-outfit">
                  {editId ? "Edit Catalog Item" : "Create New Catalog Item"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Real-time synchronization across dark store shelves and user cart
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Amul Taaza Fresh Toned Milk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    required
                  >
                    <option value="" className="dark:bg-[#121212]">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id} className="dark:bg-[#121212]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pack Unit */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Unit / Size *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="e.g. 500 ml, 1 kg, Pack of 4"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 27"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    placeholder="e.g. 30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Available Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="e.g. 85"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Primary Dark Store Assignment */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Primary Dark Store
                  </label>
                  <select
                    value={form.storeId}
                    onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  >
                    <option value="" className="dark:bg-[#121212]">All Dark Stores (Global Stock)</option>
                    {stores.map((s) => (
                      <option key={s._id} value={s._id} className="dark:bg-[#121212]">
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL with Preview */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /images/category-dairy.avif"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                    {form.imageUrl && (
                      <div className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0 bg-gray-50 dark:bg-[#1a1f2c] p-0.5">
                        <img
                          src={form.imageUrl}
                          alt="preview"
                          className="w-full h-full object-contain"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. dairy, milk, breakfast, pure"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Product Description
                  </label>
                  <textarea
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Detailed ingredients, freshness guarantee, manufacturer details..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1a1f2c] rounded-2xl border border-gray-100 dark:border-gray-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                      className="rounded text-[#0C831F] focus:ring-[#0C831F] w-4 h-4 bg-white dark:bg-[#121212] border-gray-300 dark:border-gray-700"
                    />
                    <span>Available for Sale (Online)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-700 dark:text-purple-400">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 bg-white dark:bg-[#121212] border-gray-300 dark:border-gray-700"
                    />
                    <span>⭐ Feature on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0a731b] text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editId ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
