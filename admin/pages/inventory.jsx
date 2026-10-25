import { useEffect, useState } from "react";

const API = "";

export default function InventoryAdmin() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [savingStock, setSavingStock] = useState(false);

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

  async function handleSaveStock(e) {
    if (e) e.preventDefault();
    if (!adjustItem || adjustAmount === "" || isNaN(adjustAmount)) return;
    setSavingStock(true);

    try {
      const res = await fetch(`${API}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId: selectedStore,
          productId: adjustItem.product?._id || adjustItem.product,
          stock: parseInt(adjustAmount),
        }),
      });
      if (res.ok) {
        setAdjustItem(null);
        loadInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingStock(false);
    }
  }

  const currentStoreObj = stores.find((s) => s._id === selectedStore);
  const lowStockCount = inventory.filter(
    (i) => i.stock <= (i.lowStockThreshold || 10)
  ).length;

  const filteredInventory = inventory.filter((item) => {
    const title = item.product?.title || "";
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white font-outfit">
                Dark Store Inventory & SKUs
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Real-time micro-warehouse stock counts, restock thresholds & rapid shelf adjustment
              </p>
            </div>
          </div>
        </div>

        {/* Store Selector */}
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1f2c] p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-2 whitespace-nowrap">
            Hub:
          </label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="text-xs font-bold bg-transparent text-gray-900 dark:text-white focus:outline-none cursor-pointer pr-2"
          >
            {stores.map((s) => (
              <option key={s._id} value={s._id} className="dark:bg-[#121212]">
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total SKUs in Hub
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              {inventory.length}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Active warehouse items
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
            📦
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Low Stock Warnings
            </div>
            <div className="text-2xl font-black text-amber-500 mt-1 font-outfit flex items-center gap-2">
              {lowStockCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />}
              {lowStockCount}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              {lowStockCount > 0 ? "Requires restock shipment" : "Inventory levels healthy"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md shadow-amber-500/20">
            ⚠️
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Fulfillment Location
            </div>
            <div className="text-lg font-black text-gray-900 dark:text-white mt-1 font-outfit truncate max-w-[200px]">
              {currentStoreObj?.area || "Warehouse"}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {currentStoreObj?.city || "Active Catchment Zone"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
            📍
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterLowStock(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !filterLowStock
                ? "bg-[#0C831F] text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All Products ({inventory.length})
          </button>
          <button
            onClick={() => setFilterLowStock(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterLowStock
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Low Stock Only ({lowStockCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKU by title..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="h-64 bg-white dark:bg-[#121212] animate-pulse" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 dark:bg-[#161c27] text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="py-3.5 px-5">Product SKU</th>
                  <th className="py-3.5 px-5">Unit Price</th>
                  <th className="py-3.5 px-5">Available Stock</th>
                  <th className="py-3.5 px-5">Restock Threshold</th>
                  <th className="py-3.5 px-5">Stock Health</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">
                      No inventory records found for this dark store.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const prod = item.product || {};
                    const isLow = item.stock <= (item.lowStockThreshold || 10);
                    const isOut = item.stock <= 0;

                    return (
                      <tr key={item._id} className="hover:bg-gray-50/60 dark:hover:bg-[#1a1f2c]/50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={prod.images?.[0]?.url || "https://placehold.co/40x40"}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {prod.title || "Unknown Product"}
                              </p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                                {prod.unit || "unit"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-black text-gray-900 dark:text-emerald-400 font-outfit text-sm">
                          ₹{prod.price || 0}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isOut
                                ? "text-rose-600 dark:text-rose-400"
                                : isLow
                                  ? "text-amber-500"
                                  : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {item.stock} <span className="text-xs font-normal text-gray-400">units</span>
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-gray-500 dark:text-gray-400">
                          {item.lowStockThreshold || 10} units
                        </td>
                        <td className="py-4 px-5">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => {
                              setAdjustItem(item);
                              setAdjustAmount(String(item.stock));
                            }}
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-[#0C831F] hover:text-white dark:hover:bg-[#0C831F] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm"
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

      {/* Stock Adjustment Dialog */}
      {adjustItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white font-outfit">
                  Adjust Inventory
                </h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                  {adjustItem.product?.title}
                </p>
              </div>
              <button
                onClick={() => setAdjustItem(null)}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Shelf Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1f2c] text-gray-900 dark:text-white font-mono text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
              </div>

              {/* Quick Add Buttons */}
              <div className="flex items-center gap-2">
                {[10, 25, 50, 100].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setAdjustAmount(String((parseInt(adjustAmount) || 0) + delta))}
                    className="flex-1 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[11px] font-bold text-gray-700 dark:text-gray-300"
                  >
                    +{delta}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setAdjustItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStock}
                  className="bg-[#0C831F] hover:bg-[#0a731b] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  {savingStock ? "Saving..." : "Save Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
