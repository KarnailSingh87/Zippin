import { useEffect, useState } from "react";
import Link from "next/link";

const API = "";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    stores: 0,
    partners: 0,
    activePartners: 0,
    paymentsCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    async function load() {
      try {
        const [prodRes, catRes, ordRes, storeRes, partRes, payRes] =
          await Promise.all([
            fetch(`${API}/api/products?limit=999`),
            fetch(`${API}/api/categories`),
            fetch(`${API}/api/orders/all`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`${API}/api/stores`),
            fetch(`${API}/api/delivery-partners`),
            fetch(`${API}/api/payments`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const products = prodRes.ok ? await prodRes.json() : [];
        const categories = catRes.ok ? await catRes.json() : [];
        const orders = ordRes.ok ? await ordRes.json() : [];
        const stores = storeRes.ok ? await storeRes.json() : [];
        const partners = partRes.ok ? await partRes.json() : [];
        const payments = payRes.ok ? await payRes.json() : [];

        const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
        const activePartners = partners.filter(
          (p) => p.status === "available" || p.status === "busy"
        ).length;

        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue,
          stores: stores.length,
          partners: partners.length,
          activePartners,
          paymentsCount: payments.length,
        });
        setRecentOrders(orders.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statusColors = {
    placed: "bg-blue-100 text-blue-700",
    confirmed: "bg-purple-100 text-purple-700",
    picking: "bg-yellow-100 text-yellow-700",
    out_for_delivery: "bg-orange-100 text-orange-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Operational Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time metrics for Blinkit 10-minute grocery delivery network
        </p>
      </div>

      {/* Row 1: Core E-Commerce Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.products}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Categories</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.categories}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">
              📁
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.orders}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">
              🛒
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                ₹{stats.revenue.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: DBMS Hyperlocal Fulfillment Stats (ER Model Integration) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link
          href="/stores"
          className="bg-white hover:border-admin-green rounded-xl p-5 shadow-sm border border-gray-100 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Dark Stores</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.stores} Hubs
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">
              🏬
            </div>
          </div>
          <p className="text-[11px] text-admin-green font-medium mt-2">
            View Stores & Warehouses →
          </p>
        </Link>

        <Link
          href="/delivery-partners"
          className="bg-white hover:border-admin-green rounded-xl p-5 shadow-sm border border-gray-100 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Delivery Fleet</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.activePartners}{" "}
                <span className="text-xs font-normal text-gray-500">
                  / {stats.partners} Active
                </span>
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-xl">
              🛵
            </div>
          </div>
          <p className="text-[11px] text-admin-green font-medium mt-2">
            Manage Fleet Riders →
          </p>
        </Link>

        <Link
          href="/inventory"
          className="bg-white hover:border-admin-green rounded-xl p-5 shadow-sm border border-gray-100 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Inventory Health</p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">Active</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl">
              📋
            </div>
          </div>
          <p className="text-[11px] text-admin-green font-medium mt-2">
            Check Stock & Low Alerts →
          </p>
        </Link>

        <Link
          href="/payments"
          className="bg-white hover:border-admin-green rounded-xl p-5 shadow-sm border border-gray-100 transition-all block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Settlements</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {stats.paymentsCount} Txns
              </p>
            </div>
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-xl">
              💳
            </div>
          </div>
          <p className="text-[11px] text-admin-green font-medium mt-2">
            Audit Ledger & Gateway →
          </p>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Customer Orders</h2>
          <Link
            href="/orders"
            className="text-xs text-admin-green font-semibold hover:underline"
          >
            View All ({stats.orders}) →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Dark Store</th>
                <th className="px-5 py-3 text-left font-medium">Partner</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No orders placed yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3 font-mono text-xs font-bold text-gray-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-gray-800 font-medium">
                      {order.user?.name || "Customer"}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      {order.store?.name ? (
                        <span className="truncate max-w-[150px] block">
                          {order.store.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {order.partner?.name ? (
                        <span className="font-medium text-gray-800">
                          🛵 {order.partner.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-bold text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          statusColors[order.status] || "bg-gray-100"
                        }`}
                      >
                        {order.status?.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
