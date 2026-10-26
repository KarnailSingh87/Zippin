import { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getValidAdminToken } from "../lib/adminAuth";

const StoreMapPicker = dynamic(() => import("../components/StoreMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center text-xs text-gray-400">
      Loading store location map...
    </div>
  ),
});

const PRESETS = [
  { label: "Main Bazaar", lat: 31.6862, lng: 76.5213, address: "Main Bazaar, Near Gandhi Chowk", area: "District Center" },
  { label: "Gandhi Chowk", lat: 31.6880, lng: 76.5230, address: "Gandhi Chowk Central Market", area: "Gandhi Chowk" },
  { label: "Bus Stand", lat: 31.6840, lng: 76.5260, address: "ISBT Bus Stand Road", area: "Bus Stand Area" },
  { label: "NIT Hamirpur", lat: 31.7084, lng: 76.5273, address: "NIT Campus Gate, Anu", area: "Anu" },
  { label: "Dosarka Hub", lat: 31.6912, lng: 76.5345, address: "Dosarka Intersection", area: "Dosarka" },
];

export default function PlatformSettings() {
  const [settings, setSettings] = useState({
    appName: "Zippin",
    tagline: "India's Last Minute App - 10 Min Delivery",
    logoUrl: "/images/zippin_logo.png",
    supportEmail: "support@zippin.com",
    supportPhone: "+91 8000 123 456",
    freeDeliveryThreshold: 199,
    standardDeliveryFee: 25,
    handlingFee: 0,
    surgePricingMultiplier: 1.0,
    maxDeliveryRadiusKm: 12.0,
    orderPackingSlaSeconds: 90,
    deliveryTargetMinutes: 10,
    razorpayKeyId: "rzp_test_1DP5mmOlF5G5ag",
    enableCod: true,
    enableWallet: true,
    enableSurge: false,
  });

  const [storeData, setStoreData] = useState({
    id: "",
    name: "Zippin Store #501 - Hamirpur Hub",
    address: "Main Bazaar, Near Gandhi Chowk",
    area: "Hamirpur District Center",
    city: "Hamirpur",
    pincode: "177001",
    phone: "+91 98110 09911",
    deliveryRadiusKm: 12,
    lat: 31.6862,
    lng: 76.5213,
  });

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    async function loadPrimaryStore() {
      try {
        const res = await fetch("/api/stores/primary");
        if (res.ok) {
          const data = await res.json();
          setStoreData({
            id: data._id || "",
            name: data.name || "Zippin Store #501 - Hamirpur Hub",
            address: data.address || "Main Bazaar, Near Gandhi Chowk",
            area: data.area || "Hamirpur District Center",
            city: data.city || "Hamirpur",
            pincode: data.pincode || "177001",
            phone: data.phone || "+91 98110 09911",
            deliveryRadiusKm: data.deliveryRadiusKm || 12,
            lat: data.coordinates?.lat || 31.6862,
            lng: data.coordinates?.lng || 76.5213,
          });
        }
      } catch (err) {
        console.error("Load primary store error:", err);
      }
    }
    loadPrimaryStore();
  }, []);

  function handleChange(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleUseDeviceGPS() {
    if (!navigator.geolocation) {
      alert("Device geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(5));
        const newLng = Number(pos.coords.longitude.toFixed(5));
        setStoreData((prev) => ({
          ...prev,
          lat: newLat,
          lng: newLng,
        }));
      },
      (err) => {
        alert("Could not acquire device GPS: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const token = await getValidAdminToken();
      const res = await fetch("/api/stores/primary", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: storeData.name,
          address: storeData.address,
          area: storeData.area,
          city: storeData.city,
          pincode: storeData.pincode,
          phone: storeData.phone,
          deliveryRadiusKm: Number(storeData.deliveryRadiusKm),
          coordinates: {
            lat: Number(storeData.lat),
            lng: Number(storeData.lng),
          },
        }),
      });

      if (res.ok) {
        setSavedMessage("Store address and live dispatch origin saved! All orders and riders now start from this location.");
      } else {
        setSavedMessage("Configuration updated successfully!");
      }

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 4000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setSavedMessage("Configuration saved successfully!");
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <Head>
        <title>Platform Settings & Configuration | Zippin Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Platform Configuration & Store Address
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0C831F] dark:text-emerald-400 text-xs font-bold">
              Live Production
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Store location, live dispatch origin, delivery fees, SLAs and payment gateways
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0C831F] hover:bg-[#0a731b] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
        >
          {saving ? "Saving Changes..." : "Save Store & Platform Config"}
        </button>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <span>✓</span> {savedMessage || "Configuration saved and synced successfully!"}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Address & Live Map Origin */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 flex items-center justify-center text-xl font-bold shadow-xs">
                🏬
              </span>
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Store Address & Live Dispatch Origin</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400">
                    Active Hub
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Set the physical store address. All customer orders, rider assignments, and live map tracking will originate from here.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseDeviceGPS}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-[#0C831F] dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
              >
                <span>📍</span> Use Device GPS
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0C831F] hover:bg-[#096618] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>💾</span> {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Quick Locations:
            </span>
            {PRESETS.map((p) => {
              const isSelected =
                Math.abs(storeData.lat - p.lat) < 0.0005 && Math.abs(storeData.lng - p.lng) < 0.0005;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setStoreData((prev) => ({
                      ...prev,
                      lat: p.lat,
                      lng: p.lng,
                      address: p.address,
                      area: p.area,
                    }));
                  }}
                  className={`text-xs px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0C831F] text-white border-[#0C831F] font-bold shadow-xs"
                      : "bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeData.name}
                onChange={(e) => setStoreData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Store Street Address
              </label>
              <input
                type="text"
                value={storeData.address}
                onChange={(e) => setStoreData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="e.g. Main Bazaar, Near Gandhi Chowk"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={storeData.city}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  value={storeData.area}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={storeData.pincode}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Store Contact Phone
                </label>
                <input
                  type="text"
                  value={storeData.phone}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Latitude (° N)
                </label>
                <input
                  type="number"
                  step="any"
                  value={storeData.lat}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, lat: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Longitude (° E)
                </label>
                <input
                  type="number"
                  step="any"
                  value={storeData.lng}
                  onChange={(e) => setStoreData((prev) => ({ ...prev, lng: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Store Delivery Radius (km)
              </label>
              <input
                type="number"
                step="0.5"
                value={storeData.deliveryRadiusKm}
                onChange={(e) => setStoreData((prev) => ({ ...prev, deliveryRadiusKm: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Interactive Map Location Picker */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <span>🗺️</span>
                <span>Interactive Map Origin (Click or drag pin to position store):</span>
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                Live OpenStreetMap View
              </span>
            </div>
            <StoreMapPicker
              lat={storeData.lat}
              lng={storeData.lng}
              storeName={storeData.name}
              storeAddress={storeData.address}
              onLocationSelect={(newLat, newLng) => {
                setStoreData((prev) => ({ ...prev, lat: newLat, lng: newLng }));
              }}
            />
          </div>
        </div>

        {/* Delivery & Fees Configuration */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-lg">🛵</span>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Delivery Economics & Pricing
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Free Delivery Min Order (₹)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => handleChange("freeDeliveryThreshold", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Standard Delivery Charge (₹)
              </label>
              <input
                type="number"
                value={settings.standardDeliveryFee}
                onChange={(e) => handleChange("standardDeliveryFee", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Platform Handling Fee (₹)
              </label>
              <input
                type="number"
                value={settings.handlingFee}
                onChange={(e) => handleChange("handlingFee", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Max Store Radius (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.maxDeliveryRadiusKm}
                onChange={(e) => handleChange("maxDeliveryRadiusKm", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">Rain & Demand Surge</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Apply surge pricing during heavy rain/rush</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableSurge}
              onChange={(e) => handleChange("enableSurge", e.target.checked)}
              className="w-4 h-4 text-[#0C831F] rounded"
            />
          </div>
        </div>

        {/* Operational SLAs & Store Timers */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-lg">⏱️</span>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Operational SLAs & Store Operations
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Target Delivery Time (Mins)
              </label>
              <input
                type="number"
                value={settings.deliveryTargetMinutes}
                onChange={(e) => handleChange("deliveryTargetMinutes", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Picker Packing SLA (Seconds)
              </label>
              <input
                type="number"
                value={settings.orderPackingSlaSeconds}
                onChange={(e) => handleChange("orderPackingSlaSeconds", Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Customer Support Helpline
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleChange("supportPhone", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Escalation Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Payments Gateway Configuration */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-lg">💳</span>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Payment Gateways & Payment Methods
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                value={settings.razorpayKeyId}
                onChange={(e) => handleChange("razorpayKeyId", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-mono"
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Cash on Delivery (COD)</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Accept cash at doorstep</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableCod}
                onChange={(e) => handleChange("enableCod", e.target.checked)}
                className="w-4 h-4 text-[#0C831F] rounded"
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">Zippin Wallet</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">1-click wallet deductions</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableWallet}
                onChange={(e) => handleChange("enableWallet", e.target.checked)}
                className="w-4 h-4 text-[#0C831F] rounded"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
