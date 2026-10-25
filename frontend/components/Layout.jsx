import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "./CartDrawer";
import SearchTypeahead from "./SearchTypeahead";

export default function Layout({ children }) {
  const { totalItems, totalPrice, totalSavings, isOpen, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Gurugram, Sector 43, Haryana, India");
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
      <div className="bg-[#F8CB46] text-[#1C1C1C] text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 border-b border-yellow-400">
        <span className="bg-white/80 text-[#0C831F] text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-xs">
          FASTEST
        </span>
        <span>⚡ Superfast Delivery in 8-10 Minutes | Free Delivery on orders above ₹199</span>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
          {/* Left: Official Blinkit Logo & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center group shrink-0">
              <img
                src="/images/zippin_logo_blinkit_colours.png"
                alt="Zippin"
                className="h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Vertical Divider */}
            <div className="hidden lg:block h-8 w-[1px] bg-gray-200 mx-1" />

            {/* Location Selector */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="hidden sm:flex items-center gap-2 text-left px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#0C831F] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-xs font-black text-gray-900 flex items-center gap-1">
                  Delivery in 8 minutes
                </div>
                <div className="text-[11px] text-gray-500 font-medium truncate max-w-[140px] md:max-w-[200px]">
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

            {/* User / Login */}
            <div className="relative" ref={menuRef}>
              {user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-100 font-semibold text-sm transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0C831F] text-white flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline text-sm">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-gray-800 hover:text-[#0C831F] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
              )}

              {/* User Dropdown */}
              {showUserMenu && user && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>👤</span> My Profile & Addresses
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <span>📦</span> My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors border-t border-gray-100 mt-1"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>

            {/* My Cart Button - Blinkit Green */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 bg-[#0C831F] hover:bg-[#0a701b] text-white rounded-xl px-4 py-2.5 font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0"
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
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0C831F] flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Select Delivery Location</h3>
                <p className="text-xs text-gray-500">Fast delivery available in your neighborhood</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                "Gurugram, Sector 43, Haryana, India",
                "New Delhi, Connaught Place, Delhi, India",
                "Noida, Sector 62, Uttar Pradesh, India",
                "Bengaluru, Indiranagar, Karnataka, India",
                "Mumbai, Bandra West, Maharashtra, India"
              ].map((loc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentLocation(loc);
                    setShowLocationModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-between ${
                    currentLocation === loc
                      ? "border-[#0C831F] bg-emerald-50/50 text-[#0C831F] font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {currentLocation === loc && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {/* Official Blinkit Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-100">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
              <img
                src="/images/minute_delivery.png"
                alt="10 minute delivery"
                className="w-14 h-14 object-contain shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Superfast 10-Min Delivery</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Get your order delivered to your doorstep in minutes from dark stores nearby.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
              <img
                src="/images/Best_Prices_Offers.png"
                alt="Best Prices & Offers"
                className="w-14 h-14 object-contain shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Best Prices & Offers</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Best price with direct manufacturer deals, bulk savings, and daily discounts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
              <img
                src="/images/Wide_Assortment.png"
                alt="Wide Assortment"
                className="w-14 h-14 object-contain shrink-0"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Wide Assortment</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Choose from 10,000+ items across groceries, snacks, beverages, home & pet care.
                </p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div>
              <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
                Popular Categories
              </h5>
              <ul className="space-y-2 text-xs text-gray-600 font-medium">
                <li><Link href="/category/vegetables-fruits" className="hover:text-[#0C831F]">Vegetables & Fruits</Link></li>
                <li><Link href="/category/dairy-breakfast" className="hover:text-[#0C831F]">Dairy & Breakfast</Link></li>
                <li><Link href="/category/munchies" className="hover:text-[#0C831F]">Munchies & Chips</Link></li>
                <li><Link href="/category/cold-drinks-juices" className="hover:text-[#0C831F]">Cold Drinks & Juices</Link></li>
                <li><Link href="/category/instant-frozen-food" className="hover:text-[#0C831F]">Instant & Frozen Food</Link></li>
                <li><Link href="/category/tea-coffee-health" className="hover:text-[#0C831F]">Tea, Coffee & Health</Link></li>
                <li><Link href="/category/bakery-biscuits" className="hover:text-[#0C831F]">Bakery & Biscuits</Link></li>
                <li><Link href="/category/sweet-tooth" className="hover:text-[#0C831F]">Sweet Tooth & Ice Cream</Link></li>
                <li><Link href="/category/atta-rice-dal" className="hover:text-[#0C831F]">Atta, Rice & Dal</Link></li>
                <li><Link href="/category/pharma-wellness" className="hover:text-[#0C831F]">Pharma & Wellness</Link></li>
                <li><Link href="/category/pet-care" className="hover:text-[#0C831F]">Pet Care Store</Link></li>
                <li><Link href="/category/baby-care" className="hover:text-[#0C831F]">Baby Care Essentials</Link></li>
                <li><Link href="/category/paan-corner" className="hover:text-[#0C831F] font-bold text-emerald-800">🍃 Paan Corner</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
                Useful Links
              </h5>
              <ul className="space-y-2 text-xs text-gray-600 font-medium">
                <li><a href="#" className="hover:text-[#0C831F]">About Us</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Careers</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Zippin Blog</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Press & Media</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Lead</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Customer Support</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
                Partner with us
              </h5>
              <ul className="space-y-2 text-xs text-gray-600 font-medium">
                <li><a href="#" className="hover:text-[#0C831F]">Franchise Opportunities</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Seller Central</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Warehouse Partner</a></li>
                <li><a href="#" className="hover:text-[#0C831F]">Deliver with Zippin</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
                Download Zippin App
              </h5>
              <p className="text-xs text-gray-500 mb-3">
                Experience lightning-fast grocery delivery on your mobile phone.
              </p>
              <div className="space-y-2.5">
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                  aria-label="Download on the App Store"
                >
                  <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-1.03 2.78 1.02.08 2.12-.57 2.75-1.32z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] uppercase tracking-wide opacity-80 font-normal">Download on the</div>
                    <div className="text-sm font-semibold tracking-tight">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                  aria-label="Get it on Google Play"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186A2.257 2.257 0 0 1 3 20.6V3.4A2.257 2.257 0 0 1 3.609 1.814z"/>
                    <path fill="#34A853" d="M17.18 8.613l-3.388 3.388 3.388 3.387 3.824-2.173a1.444 1.444 0 0 0 0-2.43l-3.824-2.172z"/>
                    <path fill="#EA4335" d="M13.792 12L3.61 22.186c.642.68 1.62.83 2.476.344l11.094-6.303L13.792 12z"/>
                    <path fill="#FBBC05" d="M17.18 8.613L6.086 2.31A2.183 2.183 0 0 0 3.61 1.814L13.792 12l3.388-3.387z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider opacity-80 font-medium">Get it on</div>
                    <div className="text-sm font-semibold tracking-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Legal / Copyright */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
            <p>© {new Date().getFullYear()} Zippin Technologies. All rights reserved.</p>
            <p className="text-center sm:text-right">
              “Zippin” is India's ultrafast 10-minute grocery delivery app.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
