import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AISearch from "./AISearch";
import ThemeToggle from "./ThemeToggle";

const NAV_GROUPS = [
  {
    title: "DASHBOARD",
    items: [
      {
        href: "/",
        label: "Overview",
        badge: "Live",
        badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-[#0C831F] dark:text-emerald-300 border border-emerald-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "OPERATIONS & DISPATCH",
    items: [
      {
        href: "/orders",
        label: "Customer Orders",
        badge: "Live SLA",
        badgeColor: "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        href: "/riders",
        label: "Delivery Riders",
        badge: "10 Riders",
        badgeColor: "bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
      {
        href: "/pickers",
        label: "Store Pickers",
        badge: "6 Pickers",
        badgeColor: "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        href: "/stores",
        label: "Store Facility",
        badge: "Hamirpur",
        badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-[#0C831F] dark:text-emerald-300 border border-emerald-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        href: "/customers",
        label: "Customers CRM",
        badge: "CRM",
        badgeColor: "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "CATALOG & INVENTORY",
    items: [
      {
        href: "/products",
        label: "Products Catalog",
        badge: "85 SKUs",
        badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        href: "/categories",
        label: "Categories",
        badge: "17",
        badgeColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        ),
      },
      {
        href: "/inventory",
        label: "Inventory Control",
        badge: "510 SKUs",
        badgeColor: "bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "FINANCE & MARKETING",
    items: [
      {
        href: "/revenue",
        label: "Revenue & Finance",
        badge: "₹ Ledger",
        badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.667 0 6.667-10 0-10" />
          </svg>
        ),
      },
      {
        href: "/payments",
        label: "Settlement Ledger",
        badge: "Escrow",
        badgeColor: "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
      {
        href: "/coupons",
        label: "Coupons & Promos",
        badge: "Offers",
        badgeColor: "bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        ),
      },
      {
        href: "/notifications",
        label: "Broadcast Center",
        badge: "Push",
        badgeColor: "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        ),
      },
      {
        href: "/hero-management",
        label: "Hero & Banners",
        badge: "Visuals",
        badgeColor: "bg-pink-50 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "SYSTEM & CONFIGURATION",
    items: [
      {
        href: "/settings",
        label: "Platform Settings",
        badge: "Config",
        badgeColor: "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-transparent",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
    ],
  },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Live ticking clock in IST
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] flex text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300">
      {/* AISearch Modal */}
      <AISearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Executive Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0A0D13] border-r border-gray-200/90 dark:border-gray-800/80 flex flex-col transition-colors duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200/90 dark:border-gray-800/80 bg-gray-50/80 dark:bg-[#000000] transition-colors duration-300">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 dark:border-gray-800 flex items-center justify-center p-1 shadow-xs group-hover:scale-105 transition-transform">
              <img
                src="/images/zippin_favicon_white_512.png"
                alt="Zippin Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white">zippin</span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 bg-[#0C831F] text-white rounded shadow-xs">
                  ADMIN
                </span>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Hamirpur Store Operations</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? "bg-[#0C831F] text-white shadow-md shadow-[#0C831F]/30"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/90 dark:hover:bg-gray-900/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? "bg-white/20 text-white" : item.badgeColor
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Live Operations & User footer */}
        <div className="p-3 border-t border-gray-200/90 dark:border-gray-800/80 bg-gray-50/80 dark:bg-[#000000] transition-colors duration-300">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-gray-950/60 border border-gray-200/90 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0C831F] to-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-inner">
                KS
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-gray-900 dark:text-white">Karnail Singh</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Head of Operations</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout from Admin"
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
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
        {/* Modern Top bar with ThemeToggle */}
        <header className="bg-white dark:bg-[#0A0D13] border-b border-gray-200 dark:border-gray-800/80 px-4 lg:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Zippin Admin</span>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="font-bold text-gray-900 dark:text-white capitalize tracking-tight">
                {router.pathname === "/"
                  ? "Operational Dashboard"
                  : router.pathname.slice(1).replace(/-/g, " ")}
              </span>
            </div>

            {/* Live Operations Pulse Indicator */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/70 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0C831F] dark:bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0C831F] dark:bg-emerald-400"></span>
              </span>
              <span>Store Live</span>
              <span className="text-emerald-400 dark:text-emerald-500">•</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400">{currentTime || "11:42 AM"}</span>
            </div>
          </div>

          {/* Top Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 dark:bg-[#161B22] dark:hover:bg-[#1F242C] border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-200 transition-colors shadow-2xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:inline font-medium">Quick search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-[#0A0D13] border border-gray-200 dark:border-gray-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Live Storefront Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#0C831F] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">Storefront</span>
            </a>

            {/* Theme Toggle (☀️ / 🌙) */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0A0D13]"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161B22] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 z-50 text-xs animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 font-bold text-gray-800 dark:text-white">
                    <span>Live Operations Feed</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-gray-800/80 mt-2">
                    <div className="py-2">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">🛵 Order #ORD-9841 Dispatched</p>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px]">Rider Rahul Verma en-route to DLF Cyber City (ETA 7 min)</p>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-amber-600 dark:text-amber-400">⚠️ Low Stock Alert</p>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px]">Amul Taaza Milk 500ml is below 12 units in Sector 43 Hub</p>
                    </div>
                    <div className="py-2">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">💰 Settlement Completed</p>
                      <p className="text-gray-500 dark:text-gray-400 text-[11px]">Razorpay daily settlement ₹42,850 completed successfully</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#0C831F] via-emerald-600 to-[#F8CB46] flex items-center justify-center text-white font-black text-xs shadow-md ring-2 ring-emerald-300/60 dark:ring-emerald-700/60">
              KS
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
