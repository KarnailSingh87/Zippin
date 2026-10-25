import { useEffect, useState } from "react";

const API = "";

const STATUSES = [
  "placed",
  "confirmed",
  "picking",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
const STATUS_COLORS = {
  placed: "bg-blue-100 text-blue-700",
  confirmed: "bg-purple-100 text-purple-700",
  picking: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const url = filter
        ? `${API}/api/orders/all?status=${filter}`
        : `${API}/api/orders/all`;

      const [ordRes, storeRes, partnerRes] = await Promise.all([
        fetch(url, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/stores`),
        fetch(`${API}/api/delivery-partners`),
      ]);

      if (ordRes.ok) setOrders(await ordRes.json());
      if (storeRes.ok) setStores(await storeRes.json());
      if (partnerRes.ok) setPartners(await partnerRes.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(orderId, newStatus) {
    await fetch(`${API}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
        note: `Status updated to ${newStatus}`,
      }),
    });
    load();
    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
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
        if (selectedOrder?._id === orderId) setSelectedOrder(updated);
        load();
      }
    } catch {}
  }

  async function handleAssignPartner(orderId, partnerId) {
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
        if (selectedOrder?._id === orderId) setSelectedOrder(updated);
        load();
      }
    } catch {}
  }

  if (loading)
    return <div className="h-64 bg-white rounded-xl animate-pulse" />;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${!filter ? "bg-admin-green text-white" : "bg-white text-gray-600 border"}`}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize ${filter === s ? "bg-admin-green text-white" : "bg-white text-gray-600 border"}`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 text-sm">
          No orders found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Dark Store</th>
                  <th className="px-4 py-3 text-left font-medium">Delivery Partner</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Payment</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 font-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">
                        {order.user?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {order.user?.phone || order.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {order.store?.name ? (
                        <div>
                          <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                            {order.store.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {order.store.city}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Auto-hub</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {order.partner?.name ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">🛵</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {order.partner.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              {order.partner.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{order.total}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <span className="capitalize font-medium">
                        {order.payment?.method || "cod"}
                      </span>
                      <p
                        className={`text-[10px] font-semibold ${
                          order.payment?.status === "completed"
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {order.payment?.status || "pending"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border-0 cursor-pointer ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace(/_/g, " ").toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        View & Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-400">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Customer & Address */}
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-xs">
                <p className="text-gray-800 font-semibold">
                  Customer: {selectedOrder.user?.name || "N/A"}{" "}
                  <span className="font-normal text-gray-500">
                    ({selectedOrder.user?.phone || selectedOrder.user?.email})
                  </span>
                </p>
                {selectedOrder.deliveryAddress && (
                  <p className="text-gray-600">
                    📍 {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
                  </p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-gray-500">Order Status:</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      STATUS_COLORS[selectedOrder.status]
                    }`}
                  >
                    {selectedOrder.status?.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* ER Fulfillment: Dark Store & Delivery Partner Assignment */}
              <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-3.5 space-y-3">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏬</span> Hyperlocal Fulfillment & Dispatch
                </p>

                {/* Dark Store */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Fulfillment Dark Store:
                  </label>
                  <select
                    value={selectedOrder.store?._id || selectedOrder.store || ""}
                    onChange={(e) =>
                      handleAssignStore(selectedOrder._id, e.target.value)
                    }
                    className="w-full text-xs border rounded-lg px-2.5 py-1.5 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-admin-green"
                  >
                    <option value="">Select Dark Store</option>
                    {stores.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.city} - {s.area})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Partner */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Assigned Delivery Partner:
                  </label>
                  <select
                    value={selectedOrder.partner?._id || selectedOrder.partner || ""}
                    onChange={(e) =>
                      handleAssignPartner(selectedOrder._id, e.target.value)
                    }
                    className="w-full text-xs border rounded-lg px-2.5 py-1.5 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-admin-green"
                  >
                    <option value="">Select Delivery Partner</option>
                    {partners.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name || p.firstName} ({p.phone}) — {p.status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-1 text-xs">
                <p className="font-semibold text-gray-700">Payment Breakdown</p>
                <div className="flex justify-between text-gray-600">
                  <span>Method</span>
                  <span className="font-medium uppercase">
                    {selectedOrder.payment?.method || "COD"}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Status</span>
                  <span
                    className={`font-semibold capitalize ${
                      selectedOrder.payment?.status === "completed"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {selectedOrder.payment?.status || "pending"}
                  </span>
                </div>
                {selectedOrder.payment?.transactionId && (
                  <div className="flex justify-between text-gray-600">
                    <span>Transaction Ref</span>
                    <span className="font-mono text-[10px]">
                      {selectedOrder.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-xs text-gray-700 mb-2">
                  Items ({selectedOrder.items?.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 font-mono">{item.qty}×</span>
                      <span className="flex-1 text-gray-800">{item.name}</span>
                      <span className="font-semibold">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery</span>
                  <span>
                    {selectedOrder.deliveryFee === 0
                      ? "FREE"
                      : `₹${selectedOrder.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-1">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
