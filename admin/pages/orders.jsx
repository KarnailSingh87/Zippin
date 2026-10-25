import { useEffect, useState } from "react";
import OrderInvoiceModal from "../components/OrderInvoiceModal";

const API = "";

const STATUS_CONFIG = {
  all: { label: "All Orders", color: "bg-gray-100 text-gray-700" },
  placed: { label: "Order Placed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-800 border-purple-200" },
  picking: { label: "Picking / Packing", color: "bg-amber-100 text-amber-800 border-amber-200" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-200" },
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [riders, setRiders] = useState([]);
  const [pickers, setPickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // Audio chime / beep notification for incoming orders (TC-4.2.02, TC-8.3.03)
  function playNotificationSound() {
    try {
      const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a1/S9cT8RN5PR8L93Rhg0j9Hwvnk+FzKLz/HAbjoUNYvP8b53PREzjNDvunE/ETOP0O65ckEVNI7P77hyPxE0jM/vtnVBD");
      audio.play().catch(() => {});
    } catch (e) {}
  }

  async function loadData() {
    try {
      setLoading(true);
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
      const [ordRes, storeRes, riderRes, pickerRes] = await Promise.all([
        fetch(`${API}/api/orders/all`, { headers: authHeaders }),
        fetch(`${API}/api/stores`),
        fetch(`${API}/api/delivery-partners?role=rider`, { headers: authHeaders }),
        fetch(`${API}/api/delivery-partners?role=picker`, { headers: authHeaders }),
      ]);

      if (ordRes.ok) {
        const fetchedOrders = await ordRes.json();
        if (fetchedOrders.length > orders.length && orders.length > 0) {
          playNotificationSound();
        }
        setOrders(fetchedOrders);
      }
      if (storeRes.ok) setStores(await storeRes.json());
      if (riderRes.ok) setRiders(await riderRes.json());
      if (pickerRes.ok) setPickers(await pickerRes.json());
    } catch (e) {
      console.error("Error loading orders", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  async function handleRefund(orderId) {
    if (!confirm("Issue immediate 100% gateway refund to customer and cancel this order?")) return;
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled", note: "Admin issued gateway refund" }),
      });
      if (res.ok) {
        showToast("Gateway refund issued successfully.");
        loadData();
        setSelectedOrder(null);
      } else {
        showToast("Failed to issue refund.");
      }
    } catch (e) {
      showToast("Error processing refund.");
    }
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Status updated to ${newStatus} by Admin`,
        }),
      });

      if (res.ok) {
        showToast(`Order status updated to ${newStatus.toUpperCase()}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  async function handleAssignRider(orderId, partnerId) {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/assign-partner`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partnerId }),
      });
      if (res.ok) {
        const updated = await res.json();
        showToast("Delivery Rider assigned successfully!");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, partner: updated.partner, rider: updated.rider } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, partner: updated.partner, rider: updated.rider }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssignPicker(orderId, pickerId) {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/assign-picker`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pickerId }),
      });
      if (res.ok) {
        const updated = await res.json();
        showToast("In-Store Picker assigned successfully!");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, picker: updated.picker, status: updated.status } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, picker: updated.picker, status: updated.status }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssignStore(orderId, storeId) {
    try {
      const res = await fetch(`${API}/api/orders/${orderId}/assign-store`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId }),
      });
      if (res.ok) {
        const updated = await res.json();
        showToast("Dark Store hub assigned successfully!");
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, store: updated.store } : o))
        );
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, store: updated.store }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      order.orderNumber?.toLowerCase().includes(q) ||
      order.customerName?.toLowerCase().includes(q) ||
      order.customerPhone?.includes(q) ||
      order.deliveryAddress?.addressLine?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // Tab counts
  const tabCounts = {
    all: orders.length,
    placed: orders.filter((o) => o.status === "placed").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    picking: orders.filter((o) => o.status === "picking").length,
    out_for_delivery: orders.filter((o) => o.status === "out_for_delivery").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0C831F] text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* Top Header & Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Customer Orders & Dispatch
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 text-[10px] font-black uppercase">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time quick-commerce fulfillment pipeline across 6 dark stores in Gurugram & Delhi NCR.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
          const isActive = activeTab === key;
          const count = tabCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0C831F] text-white shadow-sm shadow-[#0C831F]/30"
                  : "bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200/80 dark:border-gray-800"
              }`}
            >
              <span>{config.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#121212] p-3 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs transition-colors duration-300">
        <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by Order ID (e.g. ORD-9821), Customer name, phone number, address..."
          className="w-full text-xs md:text-sm bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold px-2 py-1 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden transition-colors duration-300">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading orders pipeline...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No orders found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-[#0c1017] text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200/80 dark:border-gray-800 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer & Phone</th>
                  <th className="py-3 px-4">Items / Total</th>
                  <th className="py-3 px-4">Fulfillment Hub & Crew</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((ord) => {
                  const statusConf = STATUS_CONFIG[ord.status] || STATUS_CONFIG.placed;
                  return (
                    <tr key={ord._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900 dark:text-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0C831F] dark:text-emerald-400 font-black">{ord.orderNumber}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                          {new Date(ord.createdAt || Date.now()).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-gray-800 dark:text-gray-200">{ord.customerName || "Customer"}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">{ord.customerPhone || "+91 98765 43210"}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[180px]">
                          {ord.deliveryAddress?.addressLine}
                        </div>
                      </td>

                      {/* Items & Total */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-gray-900 dark:text-white text-sm">₹{ord.total}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">
                          {(ord.items || []).length} items •{" "}
                          <span className="uppercase text-[10px] font-bold text-gray-400">
                            {ord.paymentMethod || "UPI"}
                          </span>
                        </div>
                      </td>

                      {/* Hub & Crew: Picker + Rider */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          <span>🏬</span>
                          <span>{ord.store?.name || "Sector 43 Hub"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <span>📦</span>
                            <span>{ord.picker?.name || "Picker: Pending"}</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span>🛵</span>
                            <span>{ord.partner?.name || ord.rider?.name || "Rider: Pending"}</span>
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateStatus(ord._id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${statusConf.color}`}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="picking">Picking / Packing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Invoice Button */}
                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            title="Generate & Print Tax Invoice"
                            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-[#0C831F] dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                          </button>

                          {/* Details Button */}
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div
            className="bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#0c1017]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-gray-900 dark:text-white">
                    {selectedOrder.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      (STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG.placed).color
                    }`}
                  >
                    {selectedOrder.status?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ordered on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInvoiceOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#0C831F] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Customer info */}
              <div className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Customer & Delivery
                </p>
                <p className="font-extrabold text-sm text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">{selectedOrder.customerPhone}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {selectedOrder.deliveryAddress?.addressLine}, {selectedOrder.deliveryAddress?.city} -{" "}
                  {selectedOrder.deliveryAddress?.pincode}
                </p>
              </div>

              {/* Order items with Genuine Blinkit Photos */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </p>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900">
                      <div className="flex items-center gap-3">
                        {it.image && (
                          <img
                            src={it.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-contain bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-0.5"
                          />
                        )}
                        <div>
                          <p className="font-extrabold text-gray-900 dark:text-white">{it.title || it.name}</p>
                          <p className="text-gray-400 text-[11px]">{it.unit} • Qty: {it.quantity || it.qty || 1}</p>
                        </div>
                      </div>
                      <div className="font-black text-gray-900 dark:text-white">₹{it.total || it.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hub, Picker & Rider Assignments */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Dispatch & Fulfillment Assignment
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Dark Store */}
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      🏬 Dark Store Hub
                    </label>
                    <select
                      value={selectedOrder.store?._id || selectedOrder.store || ""}
                      onChange={(e) => handleAssignStore(selectedOrder._id, e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                    >
                      <option value="">Select Dark Store</option>
                      {stores.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.code || s.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Store Picker */}
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                      📦 In-Store Picker
                    </label>
                    <select
                      value={selectedOrder.picker?._id || selectedOrder.picker || ""}
                      onChange={(e) => handleAssignPicker(selectedOrder._id, e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                    >
                      <option value="">Assign Store Picker</option>
                      {pickers.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.shift || "Morning"} • {p.pickingSpeedSec || 80}s)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Rider */}
                  <div className="bg-gray-50 dark:bg-gray-800/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <label className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                      🛵 Delivery Rider
                    </label>
                    <select
                      value={selectedOrder.partner?._id || selectedOrder.partner || selectedOrder.rider?._id || selectedOrder.rider || ""}
                      onChange={(e) => handleAssignRider(selectedOrder._id, e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-none"
                    >
                      <option value="">Assign Delivery Rider</option>
                      {riders.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name} ({r.vehicleNumber || r.vehicleType})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial summary */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{selectedOrder.subtotal || selectedOrder.total - 33}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{selectedOrder.deliveryFee || 25}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Taxes (5%):</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{selectedOrder.tax || 8}</span>
                </div>
                <div className="border-t border-emerald-200/80 dark:border-emerald-800/80 pt-1.5 flex justify-between text-sm font-black text-gray-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-[#0C831F] dark:text-emerald-400">₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Order Actions: Refund / Cancel */}
              <div className="flex gap-2 pt-2">
                {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                  <button
                    onClick={() => handleRefund(selectedOrder._id)}
                    className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>💸</span> Issue Gateway Refund & Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
