import { useState } from "react";
import Head from "next/head";

export default function PlatformSettings() {
  const [settings, setSettings] = useState({
    appName: "Zippin",
    tagline: "India's Last Minute App - 10 Min Delivery",
    logoUrl: "/images/zippin_logo_blinkit_colours.png",
    supportEmail: "support@zippin.com",
    supportPhone: "+91 8000 123 456",
    freeDeliveryThreshold: 199,
    standardDeliveryFee: 25,
    handlingFee: 0,
    surgePricingMultiplier: 1.0,
    maxDeliveryRadiusKm: 3.5,
    orderPackingSlaSeconds: 90,
    deliveryTargetMinutes: 10,
    razorpayKeyId: "rzp_test_1DP5mmOlF5G5ag",
    enableCod: true,
    enableWallet: true,
    enableSurge: false,
  });

  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  function handleChange(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }, 500);
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
              Platform Global Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0C831F] dark:text-emerald-400 text-xs font-bold">
              Live Production
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Centralized controls for delivery thresholds, handling charges, surge pricing, SLAs and payment gateways
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0C831F] hover:bg-[#0a731b] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
        >
          {saving ? "Saving Changes..." : "Save Platform Config"}
        </button>
      </div>

      {savedToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <span>✓</span> Configuration saved and synced across dark stores successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Operational SLAs & Dark Stores
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
