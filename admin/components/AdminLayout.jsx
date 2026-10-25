import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV_GROUPS = [
  {
    title: "OPERATIONS",
    items: [
      {
        href: "/",
        label: "Dashboard",
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        href: "/orders",
        label: "Customer Orders",
        badge: "22",
        badgeColor: "bg-blue-500/20 text-blue-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        href: "/stores",
        label: "Dark Stores",
        badge: "6 Hubs",
        badgeColor: "bg-purple-500/20 text-purple-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        href: "/delivery-partners",
        label: "Delivery Fleet",
        badge: "10 Active",
        badgeColor: "bg-amber-500/20 text-amber-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "CATALOG & STOCKS",
    items: [
      {
        href: "/products",
        label: "Products",
        badge: "160",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        href: "/categories",
        label: "Categories",
        badge: "17",
        badgeColor: "bg-gray-500/20 text-gray-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        ),
      },
      {
        href: "/inventory",
        label: "Inventory Matrix",
        badge: "300 SKUs",
        badgeColor: "bg-cyan-500/20 text-cyan-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "FINANCIALS",
    items: [
      {
        href: "/payments",
        label: "Payments & Ledger",
        badge: "Audit",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("admin_token");
    if (!t && router.pathname !== "/login") {
      router.push("/login");
    } else {
      setToken(t);
    }
  }, [router.pathname]);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setToken(null);
    router.push("/login");
  }

  if (!mounted) return null;
  if (router.pathname === "/login") return <>{children}</>;
  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-[#F4F6FB] text-gray-900 font-sans antialiased">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enterprise Dark Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col h-screen border-r border-gray-800 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-800/80">
          <div className="bg-white rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-md">
            <img
              src="/images/zippin_logo_black_chain_yellow_zip.png"
              alt="Zippin"
              className="h-7 w-auto object-contain"
            />
            <span className="text-[10px] font-black bg-[#0C831F] text-white px-2 py-0.5 rounded uppercase tracking-wider">
              OPS HUB
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All 6 Dark Stores Online
            </span>
            <span className="text-[10px] text-gray-400 font-mono">v2.4</span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="px-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2">
                {group.title}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-[#0C831F] text-white shadow-sm shadow-emerald-900/40"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? "text-white" : "text-gray-400"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Profile Card & Logout */}
        <div className="p-3 border-t border-gray-800 bg-[#0B0F19]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                HV
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-gray-200">Harsh Vardhan</div>
                <div className="text-[10px] text-gray-400">Head of Operations</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout from Admin"
              className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Modern Top bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Open Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400">Zippin Admin</span>
              <span className="text-gray-300">/</span>
              <span className="font-bold text-gray-800 capitalize">
                {router.pathname === "/"
                  ? "Operational Dashboard"
                  : router.pathname.slice(1).replace(/-/g, " ")}
              </span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Live Storefront Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0C831F] border border-emerald-200/60 hover:bg-emerald-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>View Storefront</span>
            </a>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 relative transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 text-xs animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 font-bold text-gray-800">
                    <span>Live Operations Feed</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50 mt-2">
                    <div className="py-2">
                      <p className="font-semibold text-gray-800">🛵 Order #ORD-9841 Dispatched</p>
                      <p className="text-gray-500 text-[11px]">Rider Rahul Verma en-route to DLF Cyber City (ETA 7 min)</p>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-amber-600">⚠️ Low Stock Alert</p>
                      <p className="text-gray-500 text-[11px]">Amul Taaza Milk 500ml is below 12 units in Sector 43 Hub</p>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-emerald-600">💰 Settlement Completed</p>
                      <p className="text-gray-500 text-[11px]">Razorpay daily settlement ₹42,850 completed successfully</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Refresh */}
            <button
              onClick={() => router.replace(router.asPath)}
              title="Refresh Data"
              className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
