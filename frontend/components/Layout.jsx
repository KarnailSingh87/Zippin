import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import CartDrawer from "./CartDrawer";
import SearchTypeahead from "./SearchTypeahead";
import LocationModal from "./LocationModal";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { totalItems, totalPrice, totalSavings, isOpen, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const { currentLocation, distanceKm, deliveryMinutes } = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">
      {/* Top delivery promotional announcement strip */}
      <div className="bg-[#F8CB46] text-[#1C1C1C] text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center border-b border-yellow-400">
        <span>Superfast Delivery in {deliveryMinutes} Minutes | Free Delivery on orders above ₹199</span>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
          {/* Left: Official Zippin Logo & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src="/images/zippin_logo.png"
                alt="Zippin"
                className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-8 w-[1px] bg-gray-200 mx-1" />

            {/* Location Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden sm:flex items-center gap-2 text-left px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#0C831F] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black text-gray-900 flex items-center gap-1">
                  Delivery in {deliveryMinutes} minutes
                </div>
                <div className="text-[11px] text-gray-500 font-medium truncate max-w-[150px] md:max-w-[220px]">
                  {currentLocation}
                </div>
              </div>
              <svg className="w-3.5 h-3.5 text-gray-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchTypeahead
              className="w-full"
              onNavigate={() => setShowMobileSearch(false)}
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Mobile search toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* User Account / Login */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0C831F] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="hidden sm:inline font-bold text-gray-800 text-xs">
                    {user.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.phone || user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors"
                    >
                      <span>📦</span> My Orders
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors"
                    >
                      <span>👤</span> My Profile
                    </Link>
                    <Link
                      href="/support"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors"
                    >
                      <span>💬</span> Customer Support
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        router.push("/");
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <span>🚪</span> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-xs font-bold text-gray-800 hover:text-[#0C831F] px-3.5 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 bg-[#0C831F] hover:bg-[#0a701b] text-white rounded-xl px-4 py-2.5 font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {totalItems > 0 ? (
                <div className="flex items-center gap-1.5 text-left leading-tight">
                  <span>{totalItems} item{totalItems > 1 ? "s" : ""}</span>
                  <span className="opacity-70">•</span>
                  <span>₹{totalPrice}</span>
                </div>
              ) : (
                <span>My Cart</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-gray-100 bg-white animate-slide-up">
            <SearchTypeahead mobile onClose={() => setShowMobileSearch(false)} />
          </div>
        )}

        {/* Mobile App Bar Location Strip */}
        <div className="sm:hidden px-4 py-2 bg-gradient-to-r from-emerald-50 to-amber-50 border-t border-gray-200/60 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 text-left truncate flex-1 min-w-0"
          >
            <span className="text-base shrink-0">⚡</span>
            <div className="truncate">
              <div className="font-black text-gray-900 text-xs">
                Delivery in {deliveryMinutes} minutes
              </div>
              <div className="text-[11px] text-gray-600 truncate">
                {currentLocation} ({distanceKm} km away)
              </div>
            </div>
          </button>
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-xs font-bold text-[#0C831F] bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs shrink-0 ml-2"
          >
            Change
          </button>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full">{children}</main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Bottom Cart Bar for Mobile */}
      {totalItems > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#0C831F] hover:bg-[#0a701b] text-white py-3 px-4 rounded-xl flex items-center justify-between font-bold text-sm shadow-xl active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs">
                {totalItems} item{totalItems > 1 ? "s" : ""}
              </span>
              <span>₹{totalPrice}</span>
              {totalSavings > 0 && (
                <span className="text-yellow-300 text-xs font-semibold">
                  SAVED ₹{totalSavings}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span>View Cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Official Zippin Footer */}
      <Footer />
    </div>
  );
}
