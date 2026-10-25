import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function SellerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ brand: "", category: "Food & Snacks", contact: "", email: "", gstin: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ brand: "", category: "Food & Snacks", contact: "", email: "", gstin: "" });
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Seller Central | Sell on Zippin 10-Minute Marketplace</title>
        <meta
          name="description"
          content="List your brand on Zippin. Deliver your products to millions of shoppers in 8-10 minutes."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Seller Central</span>
          </div>

          <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-cyan-900 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-3">
            <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Zippin Marketplace
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Get your brand delivered in 10 minutes.
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed max-w-xl">
              Scale D2C brand discovery, hyper-local distribution, and same-hour repeat purchases. Join 500+ top FMCG and artisanal brands selling on Zippin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">🚀</span>
              <h3 className="font-bold text-sm text-gray-900">10-Minute Velocity</h3>
              <p className="text-xs text-gray-500">Customers purchase on impulse when delivery happens in minutes.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">📊</span>
              <h3 className="font-bold text-sm text-gray-900">Live Analytics</h3>
              <p className="text-xs text-gray-500">Real-time sell-through rates, stock depletion alerts, and customer reviews.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">💰</span>
              <h3 className="font-bold text-sm text-gray-900">Fast 7-Day Settlements</h3>
              <p className="text-xs text-gray-500">Direct weekly automated bank payouts with zero hidden fees.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Register Your Brand</h2>
              <p className="text-xs text-gray-500 mt-1">Submit your brand details and start listing in our dark stores.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="text-base font-bold text-gray-900">Brand Application Received!</h3>
                <p className="text-xs text-gray-600">Our merchant onboarding manager will contact you for sample tasting and catalog upload.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand / Company Name</label>
                    <input
                      type="text"
                      required
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="e.g. Organic Goodness Foods"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="Food & Snacks">Food & Snacks</option>
                      <option value="Beverages & Health">Beverages & Health</option>
                      <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                      <option value="Home & Cleaning">Home & Cleaning</option>
                      <option value="Pet Care">Pet Care</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      placeholder="e.g. Amit Kapoor"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="amit@brand.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      required
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                      placeholder="07AAAAA0000A1Z5"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-8 py-3 rounded-xl shadow transition-all active:scale-95"
                >
                  Register as Seller
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
