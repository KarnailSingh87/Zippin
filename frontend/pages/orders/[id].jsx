import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

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
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <h1 className="text-lg font-bold text-gray-800">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
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
                Estimated
              </p>
              <p className="text-sm font-bold text-blinkit-green">10 min ⚡</p>
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
                    {info.icon} {info.label}
                  </p>
                  <p className="text-xs text-gray-500">{info.desc}</p>
                  {isCurrent && order.statusHistory && (
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(
                        order.statusHistory[order.statusHistory.length - 1]
                          ?.timestamp || order.createdAt,
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          Items in your order
        </h2>
        <div className="divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-2.5">
              <img
                src={item.image || `https://placehold.co/40x40`}
                alt=""
                className="w-10 h-10 rounded-lg object-contain bg-gray-50"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400">
                  {item.unit} × {item.qty}
                </p>
              </div>
              <span className="text-sm font-bold">
                ₹{item.price * item.qty}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bill details */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Bill Details</h2>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items total</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery fee</span>
            <span
              className={
                order.deliveryFee === 0 ? "text-blinkit-green font-medium" : ""
              }
            >
              {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-blinkit-green font-medium">
              <span>Discount</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          Delivery Details
        </h2>
        <div className="text-sm text-gray-600 space-y-1">
          {order.deliveryAddress && (
            <p>
              📍 {order.deliveryAddress.label}: {order.deliveryAddress.street},{" "}
              {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </p>
          )}
          <p>
            💳 Payment:{" "}
            {order.payment?.method === "cod"
              ? "Cash on Delivery"
              : (order.payment?.method || "N/A").toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
