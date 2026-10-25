import { useEffect, useState } from "react";

const API = "";

export default function InventoryAdmin() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [editStock, setEditStock] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function loadStores() {
    try {
      const res = await fetch(`${API}/api/stores`);
      if (res.ok) {
        const data = await res.json();
        setStores(data);
        if (data.length > 0 && !selectedStore) {
          setSelectedStore(data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadInventory() {
    if (!selectedStore) return;
    setLoading(true);
    try {
      const url = filterLowStock
        ? `${API}/api/inventory?storeId=${selectedStore}&lowStock=true`
        : `${API}/api/inventory?storeId=${selectedStore}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInventory(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      loadInventory();
    }
  }, [selectedStore, filterLowStock]);

  async function handleQuickStockUpdate(item) {
    const newStock = prompt(
      `Update stock for "${item.product?.title || "Product"}":`,
      item.stock
    );
    if (newStock === null || isNaN(newStock)) return;

    try {
      const res = await fetch(`${API}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId: selectedStore,
          productId: item.product?._id || item.product,
          stock: parseInt(newStock),
        }),
      });
      if (res.ok) loadInventory();
    } catch {}
  }

  const currentStoreObj = stores.find((s) => s._id === selectedStore);
  const lowStockCount = inventory.filter(
    (i) => i.stock <= (i.lowStockThreshold || 10)
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span> Dark Store Inventory Management
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time warehouse stock tracking & thresholds (DBMS ER Model: inventory)
          </p>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">
            Dark Store:
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="text-sm font-medium border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-admin-green"
          >
            {stores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total SKUs in Hub</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {inventory.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            📦
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {lowStockCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            ⚠️
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Fulfillment Location</p>
            <p className="text-sm font-bold text-gray-800 mt-1 truncate max-w-[180px]">
              {currentStoreObj?.area || "Warehouse"}, {currentStoreObj?.city}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl">
            📍
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLowStock(false)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              !filterLowStock
                ? "bg-admin-green text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Products ({inventory.length})
          </button>
          <button
            onClick={() => setFilterLowStock(true)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterLowStock
                ? "bg-amber-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Low Stock Only ({lowStockCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="h-64 bg-white animate-pulse" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
                <tr>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Reorder Threshold</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      No inventory records found for this dark store.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const prod = item.product || {};
                    const isLow = item.stock <= (item.lowStockThreshold || 10);
                    const isOut = item.stock <= 0;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                prod.images?.[0]?.url ||
                                "https://placehold.co/40x40"
                              }
                              alt=""
                              className="w-9 h-9 rounded-lg object-contain bg-gray-50 border p-0.5"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {prod.title || "Unknown Product"}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {prod.unit || "unit"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          ₹{prod.price || 0}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isOut
                                ? "text-red-600"
                                : isLow
                                  ? "text-amber-600"
                                  : "text-gray-900"
                            }`}
                          >
                            {item.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-gray-500">
                          {item.lowStockThreshold || 10} units
                        </td>
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleQuickStockUpdate(item)}
                            className="bg-gray-50 hover:bg-admin-green hover:text-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded font-medium transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
