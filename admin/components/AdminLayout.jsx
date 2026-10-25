import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const API = "";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/products", label: "Products", icon: "📦" },
  { href: "/categories", label: "Categories", icon: "📁" },
  { href: "/stores", label: "Dark Stores", icon: "🏬" },
  { href: "/delivery-partners", label: "Delivery Fleet", icon: "🛵" },
  { href: "/inventory", label: "Inventory", icon: "📋" },
  { href: "/orders", label: "Orders", icon: "🛒" },
  { href: "/payments", label: "Payments", icon: "💳" },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-admin-sidebar text-white transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <div className="bg-white rounded-xl px-3 py-2 flex items-center justify-between shadow-sm">
            <img
              src="/images/zippin_logo_blinkit_colours.png"
              alt="Zippin"
              className="h-7 w-auto object-contain"
            />
            <span className="text-[10px] bg-admin-green text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
              ADMIN
            </span>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === item.href
                  ? "bg-admin-green text-white"
                  : "text-gray-400 hover:text-white hover:bg-admin-sidebar-hover"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-admin-sidebar-hover w-full transition-colors"
          >
            <span className="text-lg">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800 capitalize">
            {router.pathname === "/" ? "Dashboard" : router.pathname.slice(1)}
          </h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
