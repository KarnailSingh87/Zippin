import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import OrderInvoiceModal from "../components/OrderInvoiceModal";

const API = "";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    revenue: 0,
    stores: 0,
    riders: 0,
    activeRiders: 0,
    pickers: 0,
    activePickers: 0,
    paymentsCount: 0,
    customersCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  async function loadData() {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) return;

    try {
      const [prodRes, catRes, ordRes, storeRes, partRes, payRes, usersRes] = await Promise.all([
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
        fetch(`${API}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const products = prodRes.ok ? await prodRes.json() : [];
      const categories = catRes.ok ? await catRes.json() : [];
      const orders = ordRes.ok ? await ordRes.json() : [];
      const storeData = storeRes.ok ? await storeRes.json() : [];
      const allPartners = partRes.ok ? await partRes.json() : [];
      const payments = payRes.ok ? await payRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];

      const riders = allPartners.filter((p) => p.role !== "picker");
      const pickers = allPartners.filter((p) => p.role === "picker");

      const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
      const activeRiders = riders.filter(
        (r) => r.status === "available" || r.status === "busy"
      ).length;
      const activePickers = pickers.filter(
        (p) => p.status === "available" || p.status === "busy"
      ).length;

      setStats({
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        revenue,
        stores: storeData.length,
        riders: riders.length,
        activeRiders,
        pickers: pickers.length,
        activePickers,
        paymentsCount: payments.length,
        customersCount: usersData.length || 0,
      });
      setRecentOrders(orders.slice(0, 8));
      setStores(storeData.slice(0, 4));
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  }

  function handleExportOverview() {
    const rows = [
      ["Metric", "Value"],
      ["Gross Merchandise Value (GMV)", `₹${stats.revenue}`],
      ["Total Completed Orders", stats.orders],
      ["Live Catalog SKUs", stats.products],
      ["Active Categories", stats.categories],
      ["Store Facility", "Hamirpur Hub"],
      ["Active Fleet Riders", `${stats.activePartners}/${stats.partners}`],
      ["Export Date", new Date().toLocaleString("en-IN")],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Zippin_Dashboard_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const statusColors = {
    placed: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    confirmed: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    picking: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    out_for_delivery: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    delivered: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    cancelled: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

  const filteredRecentOrders = recentOrders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const orderNo = (o.orderNumber || `ORD-${o._id.slice(-4)}`).toLowerCase();
    const cust = (o.customerName || o.user?.name || "").toLowerCase();
    return orderNo.includes(q) || cust.includes(q);
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-white dark:bg-[#121212] rounded-2xl border border-gray-200/80 dark:border-gray-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200/80 dark:border-gray-800" />
          ))}
        </div>
        <div className="h-96 rounded-2xl bg-white dark:bg-[#121212] border border-gray-200/80 dark:border-gray-800" />
      </div>
    );
  }

  // WBD styled 8-stat grid definition
  const statCards = [
    {
      title: "Gross Merchandise Value",
      value: `₹${stats.revenue.toLocaleString()}`,
      change: "+18.4%",
      subtitle: "vs yesterday • AOV ₹275",
      link: "/revenue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />
        </svg>
      ),
      color: "from-emerald-500 to-[#0C831F]",
      shadow: "shadow-emerald-500/20",
    },
    {
      title: "Completed Orders",
      value: stats.orders.toLocaleString(),
      change: "+8.2%",
      subtitle: "22 Settled • 100% verified",
      link: "/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      title: "Live Catalog SKUs",
      value: stats.products.toLocaleString(),
      change: "+5.1%",
      subtitle: `Across ${stats.categories} Categories`,
      link: "/products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      title: "Store Facility",
      value: "Hamirpur Hub",
      change: "Operational",
      subtitle: "Main Bazaar, Gandhi Chowk",
      link: "/stores",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-500/20",
    },
    {
      title: "Registered Customers",
      value: `${stats.customersCount || 0}`,
      change: "+14% Active",
      subtitle: "Verified user accounts",
      link: "/customers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-600",
      shadow: "shadow-blue-500/20",
    },
    {
      title: "Delivery Fleet Riders",
      value: `${stats.activeRiders}/${stats.riders}`,
      change: "8.4 min ETA",
      subtitle: "Riders on-road in NCR",
      link: "/riders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-teal-500 to-emerald-600",
      shadow: "shadow-teal-500/20",
    },
    {
      title: "Store Pickers & Packers",
      value: `${stats.activePickers}/${stats.pickers}`,
      change: "82s SLA",
      subtitle: "In-store bag assembly",
      link: "/pickers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/20",
    },
    {
      title: "Settlement Ledger",
      value: `₹${stats.revenue.toLocaleString()}`,
      change: "Razorpay",
      subtitle: "Instant auto-payout active",
      link: "/revenue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: "from-pink-500 to-rose-600",
      shadow: "shadow-pink-500/20",
    },
    {
      title: "Fulfillment CSAT",
      value: "4.9 ★",
      change: "2.4k Reviews",
      subtitle: "99.8% on-time delivery rate",
      link: "/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: "from-yellow-400 to-amber-500",
      shadow: "shadow-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <Head>
        <title>Dashboard | Zippin Admin Console</title>
      </Head>

      {/* Header with Title, Period Filters, Refresh, and Export (WBD style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Operational Analytics Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 text-[10px] font-black uppercase tracking-wide">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time fulfillment metrics, financial audits, and fleet telematics across active dark stores
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Period Tabs */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300">
            {["7d", "30d", "all"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  selectedPeriod === period
                    ? "bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white shadow-xs font-bold"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {period === "all" ? "All Time" : period === "7d" ? "7 Days" : "30 Days"}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh metrics"
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0C831F]" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Export Report */}
          <button
            onClick={handleExportOverview}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0C831F] hover:bg-[#096618] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* SLA & Hyperlocal Velocity Pulse Banner */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-slate-900 dark:to-black text-gray-900 dark:text-white rounded-2xl p-5 shadow-sm dark:shadow-lg border border-gray-200/90 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0C831F] to-emerald-700 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20 dark:shadow-emerald-900/50 shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
                Zippin 10-Minute Hyperlocal Operations
              </h2>
              <span className="flex items-center gap-1 text-[11px] bg-emerald-50 dark:bg-emerald-500/20 text-[#0C831F] dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0C831F] dark:bg-emerald-400 animate-pulse"></span>
                LIVE SLA 99.2%
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Instant grocery fulfillment from Zippin Hamirpur District Dark Store Hub
            </p>
          </div>
        </div>

        {/* Live SLA metrics */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Avg Packing Time</div>
            <div className="text-base font-black text-[#0C831F] dark:text-emerald-400 mt-0.5">82s SLA 📦</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Avg Transit Time</div>
            <div className="text-base font-black text-amber-600 dark:text-amber-300 mt-0.5">6.3 mins 🛵</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Active Staff Live</div>
            <div className="text-base font-black text-teal-600 dark:text-teal-400 mt-0.5">
              {stats.activeRiders} Riders • {stats.activePickers} Pickers
            </div>
          </div>
        </div>
      </div>

      {/* 8 WBD-Style High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Link
            key={idx}
            href={stat.link}
            className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-[#0C831F] dark:hover:border-emerald-500 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-gray-600 dark:text-gray-400 font-extrabold uppercase tracking-wider">
                {stat.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} text-white flex items-center justify-center font-bold shadow-sm ${stat.shadow} group-hover:scale-105 transition-transform`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {stat.change}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold truncate max-w-[150px]">
                {stat.subtitle}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Hero & Banners Card */}
        <Link
          href="/hero-management"
          className="bg-white dark:bg-[#121212] hover:border-pink-500 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Hero & Banners</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">Homepage</p>
            </div>
            <div className="w-10 h-10 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 rounded-xl flex items-center justify-center font-bold text-lg">
              🖼️
            </div>
          </div>
          <p className="text-[11px] text-pink-600 dark:text-pink-400 font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Edit Banners</span>
            <span>→</span>
          </p>
        </Link>

        {/* Revenue Analytics Card */}
        <Link
          href="/revenue"
          className="bg-white dark:bg-[#121212] hover:border-[#0C831F] rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Revenue & Ledger</p>
              <p className="text-lg font-black text-[#0C831F] dark:text-emerald-400 mt-1">Settlements</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/40 text-[#0C831F] dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg">
              💰
            </div>
          </div>
          <p className="text-[11px] text-[#0C831F] dark:text-emerald-400 font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Financial Audit</span>
            <span>→</span>
          </p>
        </Link>

        {/* Store Facility Card */}
        <Link
          href="/stores"
          className="bg-white dark:bg-[#121212] hover:border-indigo-500 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Store Facility</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-1">Hamirpur Branch</p>
            </div>
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg">
              🏬
            </div>
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Store Branch</span>
            <span>→</span>
          </p>
        </Link>

        {/* Delivery Riders Card */}
        <Link
          href="/riders"
          className="bg-white dark:bg-[#121212] hover:border-teal-500 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Delivery Fleet</p>
              <p className="text-lg font-black text-teal-600 dark:text-teal-400 mt-1">{stats.activeRiders} Riders</p>
            </div>
            <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center font-bold text-lg">
              🛵
            </div>
          </div>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Fleet Riders</span>
            <span>→</span>
          </p>
        </Link>

        {/* Store Pickers Card */}
        <Link
          href="/pickers"
          className="bg-white dark:bg-[#121212] hover:border-purple-500 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800 shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">Store Pickers</p>
              <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-1">{stats.activePickers} Pickers</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center font-bold text-lg">
              📦
            </div>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-3 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Store Pickers</span>
            <span>→</span>
          </p>
        </Link>
      </div>

      {/* Live Customer Orders Feed */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-5 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-gray-900 dark:text-white text-sm tracking-tight">
                Recent Customer Dispatches
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Real-time fulfillment stream from Hamirpur Store</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Table Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 sm:w-56 px-3 py-1.5 pl-8 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#0C831F]"
              />
              <svg
                className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 absolute left-2.5 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link
              href="/orders"
              className="text-xs font-bold text-[#0C831F] dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View All ({stats.orders})</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {filteredRecentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-xs">
            No orders matching the current filter
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Fulfillment Store</th>
                  <th className="pb-3">Fulfillment Crew</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Placed Time</th>
                  <th className="pb-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRecentOrders.map((o) => {
                  const custName = o.customerName || o.user?.name || "Customer";
                  const storeName = o.store?.name || "Zippin Cyber Hub";
                  const partnerName = o.partner?.name || (o.partner?.firstName
                    ? `${o.partner.firstName} ${o.partner.lastName || ""}`
                    : "Assigned Rider");
                  const pickerName = o.picker?.name || "Assigned Picker";

                  return (
                    <tr key={o._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-gray-800 dark:text-gray-200">
                        {o.orderNumber || `ORD-${o._id.slice(-4).toUpperCase()}`}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{custName}</div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[140px]">
                          {o.deliveryAddress?.city || "Gurugram"}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate block max-w-[150px]">
                          {storeName.replace("Zippin Dark Store #", "Store #").replace("Zippin Store #", "Store #")}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold flex items-center gap-1">
                            <span>📦</span>
                            <span className="truncate max-w-[120px]">{pickerName}</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <span>🛵</span>
                            <span className="truncate max-w-[120px]">{partnerName}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-black text-gray-900 dark:text-white">
                        ₹{o.total}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize inline-flex items-center gap-1 ${
                            statusColors[o.status] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {o.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 dark:text-gray-400 text-[11px] font-medium">
                        {new Date(o.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setInvoiceOrder(o)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#0C831F] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg border border-emerald-200/70 dark:border-emerald-800 transition-colors cursor-pointer"
                        >
                          Invoice 🧾
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Store Facility Overview */}
      {stores.length > 0 && (
        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800 p-5 transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-sm tracking-tight">
                Hamirpur Store Facility Details
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Exclusive fulfillment store branch for Hamirpur District</p>
            </div>
            <Link href="/stores" className="text-xs font-bold text-[#0C831F] dark:text-emerald-400 hover:underline">
              Manage Store Facility →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {stores.map((s) => (
              <div
                key={s._id}
                className="p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] bg-white dark:bg-gray-900 px-2 py-0.5 rounded font-bold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                      {s.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white mt-2 truncate">{s.name}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{s.address}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Radius: {s.deliveryRadiusKm || 4.5} km</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{s.totalOrdersServed || 1200}+ served</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
