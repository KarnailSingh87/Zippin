import React, { useState, useEffect } from "react";
import { useLocation } from "../context/LocationContext";
import { POPULAR_HUBS } from "../lib/constants";

export default function LocationModal({ isOpen, onClose }) {
  const {
    currentLocation,
    district,
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

  const [locationSearch, setLocationSearch] = useState("");
  const [customDistance, setCustomDistance] = useState(distanceKm || 2.0);

  useEffect(() => {
    if (distanceKm) setCustomDistance(distanceKm);
  }, [distanceKm]);

  if (!isOpen) return null;

  async function detectUserLocation() {
    if (typeof window === "undefined") return;
    setLocationStatus({ type: "loading", message: "Acquiring GPS satellite fix..." });
    await detectLocation();

    const isServiceable = stores.some((s) =>
      s.district.toLowerCase().includes((district || "").toLowerCase()) ||
      s.city.toLowerCase().includes((district || "").toLowerCase()) ||
      ["hamirpur", "himachal"].some((c) =>
        (currentLocation || "").toLowerCase().includes(c)
      ) ||
      distanceKm <= 20
    );

    if (isServiceable) {
      setLocationStatus({
        type: "success",
        message: `Location detected successfully! ⚡ ${deliveryMinutes}-min delivery (${distanceKm} km from Hamirpur store)`,
      });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setLocationStatus({
        type: "error",
        message: "Area is currently not serviceable. Coming soon to your locality! ⚡",
      });
    }
  }

  const dynamicEta = Math.max(5, Math.round(3 + (customDistance || 2.0) * 2.5));

  function handleClose() {
    setLocationStatus(null);
    setLocationSearch("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-slide-up border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
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
              Deliveries calculated dynamically from Gandhi Chowk, Hamirpur
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
            placeholder="Search Hamirpur localities (e.g. Gandhi Chowk, NIT, Anu, Salasi, Mattan Sidh)..."
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
                  <span>🏪</span> Hamirpur Store Hub Origin
                </div>
                <div className="font-black text-gray-900 text-sm mt-1">
                  {locationSearch}
                </div>
                <div className="text-[11px] text-gray-600 font-medium mt-0.5">
                  Origin: Zippin Store #501 - Hamirpur Hub
                </div>
                <div className="text-[10px] text-gray-400">
                  Near Main Bus Stand & Gandhi Chowk, Hamirpur (PIN: 177001)
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
                <span>Distance from Hamirpur Hub (Gandhi Chowk):</span>
                <span className="font-black text-[#0C831F]">{customDistance} km ({dynamicEta} mins delivery)</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { dist: 0.5, eta: 5 },
                  { dist: 1.0, eta: 6 },
                  { dist: 2.0, eta: 8 },
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
                handleClose();
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
            Fast Delivery Available Across Hamirpur Localities:
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
                const isSelected =
                  currentLocation.toLowerCase().includes(loc.district.toLowerCase()) ||
                  currentLocation === loc.name;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setManualLocation(loc.name, loc.defaultDist);
                      handleClose();
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
  );
}
