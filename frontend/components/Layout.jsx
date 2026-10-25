import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, DISTRICT_DARK_STORES } from "../context/LocationContext";
import CartDrawer from "./CartDrawer";
import SearchTypeahead from "./SearchTypeahead";

export default function Layout({ children }) {
  const { totalItems, totalPrice, totalSavings, isOpen, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const {
    currentLocation,
    district,
    stateName,
    distanceKm,
    deliveryMinutes,
    originStore,
    isDetecting,
    locationStatus,
    setLocationStatus,
    detectLocation,
    setManualLocation,
    updateDistance,
    stores,
  } = useLocation();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [customDistance, setCustomDistance] = useState(distanceKm || 2.0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    if (distanceKm) setCustomDistance(distanceKm);
  }, [distanceKm]);

  // Automatic GPS Geolocation & Reverse Geocoding with district origin cross-reference
  async function detectUserLocation() {
    if (typeof window === "undefined") return;
    setLocationStatus({ type: "loading", message: "Acquiring GPS satellite fix..." });
    const res = await detectLocation();

    // Verify dark store coverage against active dark stores
    const isServiceable = stores.some((s) =>
      s.district.toLowerCase().includes((district || "").toLowerCase()) ||
      s.city.toLowerCase().includes((district || "").toLowerCase()) ||
      ["hamirpur", "gurugram", "delhi", "noida", "bengaluru", "mumbai", "shimla"].some((c) =>
        (currentLocation || "").toLowerCase().includes(c)
      )
    );

    if (isServiceable) {
      setLocationStatus({
        type: "success",
        message: `Location detected successfully! ⚡ ${deliveryMinutes}-min delivery (${distanceKm} km from ${district} store)`,
      });
      setTimeout(() => {
        setShowLocationModal(false);
      }, 1200);
    } else {
      setLocationStatus({
        type: "error",
        message: "Area is currently not serviceable. Coming soon to your city! ⚡",
      });
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matchedOriginStore =
    stores.find(
      (s) =>
        (locationSearch && (
          s.district.toLowerCase().includes(locationSearch.toLowerCase()) ||
          s.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
          locationSearch.toLowerCase().includes(s.district.toLowerCase()) ||
          locationSearch.toLowerCase().includes(s.city.toLowerCase())
        ))
    ) || originStore;

  const dynamicEta = Math.max(5, Math.round(3 + (customDistance || 2.0) * 2.5));

  const POPULAR_HUBS = [
    {
      name: "Hamirpur, Gandhi Chowk / District Center, HP, India",
      hub: "Zippin Dark Store #501 - Hamirpur District Hub",
      city: "Hamirpur",
      district: "Hamirpur",
      state: "Himachal Pradesh",
      pin: "177001",
      defaultDist: 2.0,
      eta: 8,
    },
    {
      name: "Hamirpur, NIT Hamirpur Campus, HP, India",
      hub: "Zippin Dark Store #501 - Hamirpur District Hub",
      city: "Hamirpur",
      district: "Hamirpur",
      state: "Himachal Pradesh",
      pin: "177005",
      defaultDist: 3.5,
      eta: 12,
    },
    {
      name: "Hamirpur, Anu Chowk / Salasi, HP, India",
      hub: "Zippin Dark Store #501 - Hamirpur District Hub",
      city: "Hamirpur",
      district: "Hamirpur",
      state: "Himachal Pradesh",
      pin: "177001",
      defaultDist: 1.2,
      eta: 6,
    },
    { name: "Gurugram, Sector 43, Haryana, India", hub: "Cyber City Hub #101", city: "Gurugram", district: "Gurugram", pin: "122002", defaultDist: 2.0, eta: 8 },
    { name: "Gurugram, DLF Phase 2, Haryana, India", hub: "Golf Course Hub #102", city: "Gurugram", district: "Gurugram", pin: "122008", defaultDist: 1.8, eta: 8 },
    { name: "New Delhi, Connaught Place, Delhi, India", hub: "CP Central Hub #201", city: "New Delhi", district: "New Delhi", pin: "110001", defaultDist: 2.0, eta: 8 },
    { name: "New Delhi, Saket / South Delhi, Delhi, India", hub: "Saket Metro Hub #202", city: "New Delhi", district: "South Delhi", pin: "110017", defaultDist: 2.2, eta: 8 },
    { name: "Noida, Sector 62, Uttar Pradesh, India", hub: "Electronic City Hub #301", city: "Noida", district: "Gautam Buddha Nagar", pin: "201309", defaultDist: 2.5, eta: 9 },
    { name: "Noida, Sector 18, Uttar Pradesh, India", hub: "Atta Market Hub #302", city: "Noida", district: "Gautam Buddha Nagar", pin: "201301", defaultDist: 2.0, eta: 8 },
    { name: "Bengaluru, Indiranagar, Karnataka, India", hub: "100ft Road Hub #401", city: "Bengaluru", district: "Bengaluru Urban", pin: "560038", defaultDist: 2.0, eta: 8 },
    { name: "Bengaluru, Koramangala, Karnataka, India", hub: "Sony Signal Hub #402", city: "Bengaluru", district: "Bengaluru Urban", pin: "560034", defaultDist: 2.0, eta: 8 },
    { name: "Mumbai, Bandra West, Maharashtra, India", hub: "Hill Road Hub #501", city: "Mumbai", district: "Mumbai Suburban", pin: "400050", defaultDist: 2.0, eta: 8 },
    { name: "Mumbai, Andheri East, Maharashtra, India", hub: "MIDC Tech Hub #502", city: "Mumbai", district: "Mumbai Suburban", pin: "400093", defaultDist: 2.5, eta: 9 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col font-sans">
      {/* Top delivery promotional announcement strip */}
      <div className="bg-[#F8CB46] text-[#1C1C1C] text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center border-b border-yellow-400">
        <span>Superfast Delivery in {deliveryMinutes} Minutes | Free Delivery on orders above ₹199</span>
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
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-slide-up border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowLocationModal(false);
                setLocationStatus(null);
                setLocationSearch("");
              }}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 absolute top-5 right-5 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0C831F] flex items-center justify-center shadow-inner shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg tracking-tight">Select Delivery Location</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Origin-calculated delivery time from your District Dark Store
                </p>
              </div>
            </div>

            {/* GPS Auto Detect Button */}
            <div className="mb-4">
              <button
                onClick={detectUserLocation}
                disabled={isDetecting}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#0C831F] hover:from-emerald-600 hover:to-[#0a731b] text-white flex items-center justify-between shadow-md shadow-emerald-900/20 active:scale-[0.99] transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    {isDetecting ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                      <span>Detect My Current Location</span>
                      <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase">GPS</span>
                    </div>
                    <div className="text-[11px] text-emerald-100 font-medium">
                      {isDetecting ? "Locating doorstep via satellite..." : "Automatically fetch address via browser GPS"}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold bg-white text-[#0C831F] px-2.5 py-1 rounded-xl shadow-xs">
                  {isDetecting ? "Locating..." : "Auto Fetch"}
                </div>
              </button>

              {/* Status Message */}
              {locationStatus && (
                <div
                  className={`mt-2 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    locationStatus.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : locationStatus.type === "loading"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  <span>
                    {locationStatus.type === "success" ? "✅" : locationStatus.type === "loading" ? "🛰️" : "⚠️"}
                  </span>
                  <span>{locationStatus.message}</span>
                </div>
              )}
            </div>

            {/* Manual Type Location Search Input */}
            <div className="relative mb-3">
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Type district, city, landmark or pincode (e.g. Hamirpur, Gurugram)..."
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {locationSearch && (
                <button
                  onClick={() => setLocationSearch("")}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Interactive District Store Origin & Distance Time Calculator */}
            {locationSearch && (
              <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border border-emerald-200 shadow-sm space-y-3 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C831F] text-[10px] font-black uppercase">
                      <span>🏪</span> District Store Origin
                    </div>
                    <div className="font-black text-gray-900 text-sm mt-1">
                      {locationSearch}
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                      Origin: {matchedOriginStore?.name || "Zippin District Hub"}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {matchedOriginStore?.address || "District Fulfillment Center"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-[#0C831F] bg-white px-3 py-1.5 rounded-xl shadow-xs border border-emerald-200">
                      ⚡ {dynamicEta} MINS
                    </div>
                    <div className="text-[10px] text-gray-500 font-semibold mt-1">
                      {customDistance} km away
                    </div>
                  </div>
                </div>

                {/* Distance Selector Buttons */}
                <div className="pt-2 border-t border-emerald-200/60">
                  <div className="text-[10px] font-bold text-gray-600 mb-1.5 flex items-center justify-between">
                    <span>Distance from {matchedOriginStore?.district || "District"} Store:</span>
                    <span className="font-black text-[#0C831F]">{customDistance} km ({dynamicEta} mins delivery)</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { dist: 0.5, eta: 5 },
                      { dist: 1.0, eta: 6 },
                      { dist: 2.0, eta: 8 }, // 2 km = 8 mins!
                      { dist: 3.5, eta: 12 },
                      { dist: 5.0, eta: 16 },
                      { dist: 8.0, eta: 23 },
                    ].map((item) => (
                      <button
                        key={item.dist}
                        type="button"
                        onClick={() => {
                          setCustomDistance(item.dist);
                          updateDistance(item.dist);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          customDistance === item.dist
                            ? "bg-[#0C831F] text-white shadow-sm scale-105"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        {item.dist} km • ⚡ {item.eta}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Range Slider for granular distance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                    <span>0.5 km (5m)</span>
                    <span className="font-bold text-emerald-700">2.0 km (8m)</span>
                    <span>5.0 km (16m)</span>
                    <span>10.0 km (28m)</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.5"
                    value={customDistance}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomDistance(val);
                      updateDistance(val);
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0C831F]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fullLoc =
                      locationSearch.toLowerCase().includes("hamirpur") &&
                      !locationSearch.toLowerCase().includes("himachal")
                        ? `${locationSearch}, Himachal Pradesh, India`
                        : locationSearch;
                    setManualLocation(fullLoc, customDistance);
                    setShowLocationModal(false);
                    setLocationSearch("");
                    setLocationStatus({
                      type: "success",
                      message: `Location set to ${fullLoc}! Delivery in ${dynamicEta} mins ⚡`,
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0C831F] hover:bg-[#0a731b] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shadow-emerald-900/20 active:scale-95 cursor-pointer"
                >
                  Deliver Here in {dynamicEta} Minutes
                </button>
              </div>
            )}

            {/* Popular / Saved Delivery Hubs */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Fast Delivery Available In:
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {POPULAR_HUBS
                  .filter((item) =>
                    !locationSearch ||
                    item.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
                    item.pin.includes(locationSearch) ||
                    item.hub.toLowerCase().includes(locationSearch.toLowerCase()) ||
                    item.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
                    item.district.toLowerCase().includes(locationSearch.toLowerCase())
                  )
                  .map((loc, i) => {
                    const isSelected = currentLocation.toLowerCase().includes(loc.district.toLowerCase()) || currentLocation === loc.name;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setManualLocation(loc.name, loc.defaultDist);
                          setShowLocationModal(false);
                          setLocationStatus(null);
                        }}
                        className={`w-full text-left p-3 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-[#0C831F] bg-emerald-50/70 text-[#0C831F] font-bold shadow-xs"
                            : "border-gray-100 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{isSelected ? "📍" : "🏢"}</span>
                          <div className="truncate">
                            <div className="truncate font-bold text-gray-900">{loc.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {loc.hub} • PIN: {loc.pin}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-[#0C831F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ⚡ {loc.eta} min ({loc.defaultDist} km)
                          </span>
                          {isSelected && <span className="text-xs font-black text-[#0C831F]">✓</span>}
                        </div>
                      </button>
                    );
                  })}
                {locationSearch &&
                  !POPULAR_HUBS.some(
                    (item) =>
                      item.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
                      item.pin.includes(locationSearch) ||
                      item.hub.toLowerCase().includes(locationSearch.toLowerCase()) ||
                      item.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
                      item.district.toLowerCase().includes(locationSearch.toLowerCase())
                  ) && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                      <span className="text-xl">📍</span>
                      <div className="text-xs font-bold text-amber-900">Area Not Serviceable</div>
                      <div className="text-[11px] text-amber-700">
                        This pincode is currently unserviceable. Coming soon to your neighborhood! 🚀
                      </div>
                    </div>
                  )}
              </div>
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
                <li><Link href="/about" className="hover:text-[#0C831F]">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-[#0C831F]">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-[#0C831F]">Zippin Blog</Link></li>
                <li><Link href="/press" className="hover:text-[#0C831F]">Press & Media</Link></li>
                <li><Link href="/lead" className="hover:text-[#0C831F]">Lead</Link></li>
                <li><Link href="/support" className="hover:text-[#0C831F]">Customer Support</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
                Partner with us
              </h5>
              <ul className="space-y-2 text-xs text-gray-600 font-medium">
                <li><Link href="/partner/franchise" className="hover:text-[#0C831F]">Franchise Opportunities</Link></li>
                <li><Link href="/partner/seller" className="hover:text-[#0C831F]">Seller Central</Link></li>
                <li><Link href="/partner/warehouse" className="hover:text-[#0C831F]">Warehouse Partner</Link></li>
                <li><Link href="/partner/delivery" className="hover:text-[#0C831F]">Deliver with Zippin</Link></li>
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
                <Link
                  href="/download"
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
                </Link>
                <Link
                  href="/download"
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
                </Link>
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
