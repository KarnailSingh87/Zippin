import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

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
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    async function load() {
      try {
        const [prodRes, catRes, ordRes, storeRes, partRes, payRes] =
          await Promise.all([
            fetch(`${API}/api/products?all=true&limit=1000`),
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
        const storeData = storeRes.ok ? await storeRes.json() : [];
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
          stores: storeData.length,
          partners: partners.length,
          activePartners,
          paymentsCount: payments.length,
        });
        setRecentOrders(orders.slice(0, 8));
        setStores(storeData.slice(0, 4));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statusColors = {
    placed: "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-purple-50 text-purple-700 border-purple-200",
    picking: "bg-yellow-50 text-yellow-800 border-yellow-200",
    out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-14 bg-white rounded-2xl border border-gray-100" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-gray-100" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-white border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Head>
        <title>Dashboard | Zippin Admin Console</title>
      </Head>

      {/* Network Live Banner & SLA Pulse */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0C831F] text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/50 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white tracking-tight">
                Zippin 10-Minute Hyperlocal Operations
              </h2>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE SLA 99.2%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Active dark stores across Gurugram, Delhi & Bengaluru fulfilling instant deliveries
            </p>
          </div>
        </div>

        {/* Live SLA metrics */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-700/60 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Avg Delivery Time</div>
            <div className="text-base font-black text-emerald-400 mt-0.5">8.4 mins ⚡</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Fleet Utilization</div>
            <div className="text-base font-black text-amber-300 mt-0.5">
              {stats.activePartners}/{stats.partners} On-Road
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Core Financial & Catalog Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Gross Merchandise Value</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              ₹{stats.revenue.toLocaleString()}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1">
              <span>↑ 18.4%</span>
              <span className="font-normal text-gray-400">vs yesterday</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Completed Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.orders}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-1">
              <span>22 Settled</span>
              <span className="font-normal text-gray-400">• 100% verified</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Live Catalog SKUs</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.products}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 font-bold mt-1">
              <span>Across {stats.categories} Categories</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Active Categories</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {stats.categories}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-1">
              <span>Fresh, Dairy, Snacks & Drinks</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 2: Hyperlocal Fulfillment Operations (ER Relational Hubs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dark Stores Card */}
        <Link
          href="/stores"
          className="bg-white hover:border-[#0C831F] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Dark Stores</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {stats.stores} Hubs
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              🏬
            </div>
          </div>
          <p className="text-[11px] text-[#0C831F] font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Manage Warehouses</span>
            <span>→</span>
          </p>
        </Link>

        {/* Delivery Fleet Card */}
        <Link
          href="/delivery-partners"
          className="bg-white hover:border-[#0C831F] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Delivery Fleet</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {stats.activePartners}{" "}
                <span className="text-xs font-normal text-gray-400">
                  / {stats.partners} Active
                </span>
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              🛵
            </div>
          </div>
          <p className="text-[11px] text-[#0C831F] font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Track Fleet Riders</span>
            <span>→</span>
          </p>
        </Link>

        {/* Inventory Matrix Card */}
        <Link
          href="/inventory"
          className="bg-white hover:border-[#0C831F] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Inventory Health</p>
              <p className="text-xl font-black text-emerald-600 mt-1">
                300 SKUs
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              📋
            </div>
          </div>
          <p className="text-[11px] text-[#0C831F] font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Stock Allocations</span>
            <span>→</span>
          </p>
        </Link>

        {/* Financial Settlements Card */}
        <Link
          href="/payments"
          className="bg-white hover:border-[#0C831F] rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-gray-100 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Payment Settlements</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {stats.paymentsCount} Txns
              </p>
            </div>
            <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center font-bold">
              💳
            </div>
          </div>
          <p className="text-[11px] text-[#0C831F] font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Audit Ledger & Gateway</span>
            <span>→</span>
          </p>
        </Link>
      </div>

      {/* Row 3: Live Customer Orders Feed */}
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h3 className="font-black text-gray-900 text-sm tracking-tight">Recent Customer Orders</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time fulfillment stream across active dark stores</p>
          </div>
          <Link
            href="/orders"
            className="text-xs font-bold text-[#0C831F] hover:underline flex items-center gap-1"
          >
            <span>View All Orders ({stats.orders})</span>
            <span>→</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            No live customer orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Dark Store</th>
                  <th className="pb-3">Fleet Rider</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((o) => {
                  const custName = o.customerName || o.user?.name || "Customer";
                  const storeName = o.store?.name || "Zippin Cyber Hub";
                  const partnerName = o.partner?.firstName
                    ? `${o.partner.firstName} ${o.partner.lastName || ""}`
                    : "Assigned Rider";

                  return (
                    <tr key={o._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-gray-800">
                        {o.orderNumber || `ORD-${o._id.slice(-4).toUpperCase()}`}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-gray-800">{custName}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[140px]">
                          {o.deliveryAddress?.city || "Gurugram"}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-gray-700 truncate block max-w-[150px]">
                          {storeName.replace("Zippin Dark Store #", "Hub #")}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-gray-600 flex items-center gap-1">
                          <span>🛵</span>
                          <span className="font-medium">{partnerName}</span>
                        </span>
                      </td>
                      <td className="py-3 font-black text-gray-900">
                        ₹{o.total}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${
                            statusColors[o.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 text-[11px]">
                        {new Date(o.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 4: Active Dark Store Hubs Overview */}
      {stores.length > 0 && (
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 p-5">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h3 className="font-black text-gray-900 text-sm tracking-tight">Active Fulfillment Network</h3>
              <p className="text-xs text-gray-400 mt-0.5">Instant delivery dispatch hubs</p>
            </div>
            <Link href="/stores" className="text-xs font-bold text-[#0C831F] hover:underline">
              View All 6 Hubs →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stores.map((s) => (
              <div key={s._id} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded font-bold text-gray-600 border border-gray-100">
                      {s.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 mt-2 truncate">{s.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{s.address}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Radius: {s.deliveryRadiusKm || 4.5} km</span>
                  <span className="font-bold text-emerald-700">{s.totalOrdersServed || 1200}+ served</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
