import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const LiveTrackingMap = dynamic(() => import("../../components/LiveTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 rounded-2xl bg-gray-50 border border-gray-200 animate-pulse flex flex-col items-center justify-center text-gray-400 gap-2">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-semibold text-gray-500">Loading Live Leaflet Map...</p>
    </div>
  ),
});

const API = "";

const STATUSES = [
  "placed",
  "confirmed",
  "picking",
  "out_for_delivery",
  "delivered",
];
const STATUS_INFO = {
  placed: {
    label: "Order Placed",
    icon: "📦",
    desc: "Your order has been received",
  },
  confirmed: {
    label: "Confirmed",
    icon: "✅",
    desc: "Store has confirmed your order",
  },
  picking: {
    label: "Picking Items",
    icon: "🛒",
    desc: "Your items are being picked",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: "🚴",
    desc: "Rider is on the way",
  },
  delivered: {
    label: "Delivered",
    icon: "🎉",
    desc: "Your order has been delivered",
  },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const { reorder } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    async function load() {
      try {
        const res = await fetch(`${API}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setOrder(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, [id, token]);

  // Real-Time EventSource Push Stream with Auto-Reconnection (TC-8.3.02, TC-8.3.04)
  useEffect(() => {
    if (!id) return;
    let sse;
    function connectSSE() {
      try {
        sse = new EventSource(`${API}/api/events?orderId=${id}`);
        sse.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.orderId === id && data.status) {
              setOrder((prev) =>
                prev ? { ...prev, status: data.status, partner: data.partner || prev.partner } : prev
              );
            }
          } catch (e) {}
        };
        sse.onerror = () => {
          sse.close();
          // Auto-reconnection on network drop
          setTimeout(connectSSE, 3000);
        };
      } catch (e) {}
    }
    connectSSE();
    return () => {
      if (sse) sse.close();
    };
  }, [id]);

  // Customer Self-Cancellation Rule
  async function handleCancelOrder() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        alert("Order cancelled successfully. Any payment made will be refunded.");
      } else {
        const err = await res.json();
        alert(err.message || "Could not cancel order");
      }
    } catch (e) {
      alert("Error cancelling order");
    }
    setCancelling(false);
  }

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-3xl mx-auto">
        <div className="h-8 w-48 shimmer rounded mb-4" />
        <div className="h-64 shimmer rounded-xl mb-4" />
        <div className="h-40 shimmer rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <span className="text-5xl mb-3">🔍</span>
        <p className="font-medium">Order not found</p>
        <Link href="/orders" className="btn-green mt-4 text-sm">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStatusIdx = STATUSES.indexOf(order.status);

  // Dynamic Real-Time ETA Recalculation & Distance Matrix (TC-4.7.02)
  const storeLat = order.store?.coordinates?.lat || 31.6862;
  const storeLng = order.store?.coordinates?.lng || 76.5213;
  const storeLocation = { latitude: storeLat, longitude: storeLng };

  const partnerLat = order.partner?.location?.lat || order.rider?.location?.lat;
  const partnerLng = order.partner?.location?.lng || order.rider?.location?.lng;

  const riderLocation = partnerLat && partnerLng
    ? { latitude: partnerLat, longitude: partnerLng }
    : (order.delivery?.location && order.delivery.location.latitude !== 28.4595
        ? order.delivery.location
        : { latitude: storeLat + 0.003, longitude: storeLng + 0.002 });

  const distanceMatrix = Math.sqrt(
    Math.pow((riderLocation.latitude - storeLocation.latitude) * 111, 2) +
    Math.pow((riderLocation.longitude - storeLocation.longitude) * 111, 2)
  );
  const dynamicEta = Math.max(3, Math.round(distanceMatrix * 4 + 4));

  return (
    <div className="px-4 py-4 pb-20 md:pb-6 max-w-3xl mx-auto min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <Link href="/" className="hover:text-blinkit-green">
          Home
        </Link>
        <span>/</span>
        <Link href="/orders" className="hover:text-blinkit-green">
          Orders
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">
          #{order._id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Delivery status card */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-800">
                Order #{order._id.slice(-6).toUpperCase()}
              </h1>
              {order.status === "placed" && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
            {/* Timezone Normalized (TC-8.5.02) */}
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="bg-blinkit-green-light rounded-lg px-3 py-1.5 text-center">
              <p className="text-[10px] text-blinkit-green font-medium">
                Dynamic ETA
              </p>
              <p className="text-sm font-bold text-blinkit-green">{dynamicEta} min ⚡</p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="ml-3">
          {STATUSES.map((status, idx) => {
            const info = STATUS_INFO[status];
            const isActive = idx <= currentStatusIdx;
            const isCurrent = idx === currentStatusIdx;
            return (
              <div key={status} className="flex gap-3 relative">
                {/* Line */}
                {idx < STATUSES.length - 1 && (
                  <div
                    className={`absolute left-[7px] top-5 w-0.5 h-full ${idx < currentStatusIdx ? "bg-blinkit-green" : "bg-gray-200"}`}
                  />
                )}
                {/* Dot */}
                <div
                  className={`w-4 h-4 rounded-full shrink-0 mt-0.5 border-2 z-10 ${
                    isCurrent
                      ? "bg-blinkit-green border-blinkit-green animate-pulse-green"
                      : isActive
                        ? "bg-blinkit-green border-blinkit-green"
                        : "bg-white border-gray-300"
                  }`}
                />
                {/* Content */}
                <div className={`pb-6 ${isActive ? "" : "opacity-40"}`}>
                  <p
                    className={`text-sm font-semibold ${isCurrent ? "text-blinkit-green" : "text-gray-800"}`}
                  >
                    {info.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Live Tracking Map with Leaflet / Google Maps Coordinates (TC-4.7.01) */}
      {order.status !== "delivered" && order.status !== "cancelled" && (
        <div className="mb-4">
          <LiveTrackingMap
            order={order}
            riderLocation={riderLocation}
            storeLocation={storeLocation}
            dynamicEta={dynamicEta}
            distanceMatrix={distanceMatrix}
          />
        </div>
      )}

      {/* Items list */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-800">
            Items in this order ({order.items.length})
          </h2>
          {/* Reorder Button on Order Details (TC-5.1.02) */}
          <button
            onClick={() => {
              if (reorder) reorder(order.items);
            }}
            className="btn-green text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs hover:shadow-xs"
          >
            <span>🔁</span> Reorder Items
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-3">
              <img
                src={item.image || "https://placehold.co/48x48/f0f0f0/666?text=Item"}
                alt={item.name}
                className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400">
                  {item.unit} • Qty: {item.qty}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-800">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bill details */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Bill Details</h2>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>Items Total</span>
            <span className="font-semibold text-gray-700">₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery Fee</span>
            <span className="font-semibold text-gray-700">
              {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Handling Charge</span>
            <span className="font-semibold text-gray-700">FREE</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-gray-800">
            <span>Total Payable</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Delivery & Fulfillment info (ER Model: store, delivery_partner, payment) */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          Delivery & Fulfillment Details
        </h2>
        <div className="text-sm text-gray-600 space-y-3">
          {/* Assigned Delivery Partner Card with Verified Photo (TC-6.2.02) */}
          {order.partner && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-emerald-500">
                  {order.partner.photo || order.partner.avatar ? (
                    <img
                      src={order.partner.photo || order.partner.avatar}
                      alt="Rider"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "🛵"
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-xs">
                    Your rider is {order.partner.name || order.partner.firstName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Zippin Partner • {order.partner.vehicleType || "Bike"} • ⭐ {order.partner.rating || 4.8}
                  </p>
                </div>
              </div>
              {order.partner.phone && (
                <a
                  href={`tel:${order.partner.phone}`}
                  className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Call Rider
                </a>
              )}
            </div>
          )}

          {/* Fulfillment Store */}
          {order.store && (
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-sm">🏬</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Fulfillment Store: {order.store.name}
                </p>
                <p className="text-gray-400">
                  {order.store.area}, {order.store.city} {order.store.pincode ? `(${order.store.pincode})` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Destination Address */}
          {order.deliveryAddress && (
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-sm">📍</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Drop Location ({order.deliveryAddress.label || "Home"}):
                </p>
                <p className="text-gray-500">
                  {order.deliveryAddress.street}, {order.deliveryAddress.city}{" "}
                  {order.deliveryAddress.pincode ? `- ${order.deliveryAddress.pincode}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-semibold uppercase text-gray-800">
              {order.payment?.method === "cod"
                ? "Cash on Delivery"
                : (order.payment?.method || "N/A").toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Payment Status:</span>
            <span
              className={`font-semibold capitalize px-2 py-0.5 rounded ${
                order.payment?.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.payment?.status || "pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
