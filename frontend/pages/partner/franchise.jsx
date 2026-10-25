import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function FranchisePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", area: "", investment: "₹15L - ₹25L" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", city: "", area: "", investment: "₹15L - ₹25L" });
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Franchise Opportunities | Partner with Zippin Dark Store Network</title>
        <meta
          name="description"
          content="Own and operate a high-yield Zippin dark store micro-fulfillment franchise in your city."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Franchise Opportunities</span>
          </div>

          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-3">
            <span className="bg-black/60 backdrop-blur-xs text-yellow-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              High Growth Franchise
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Own a Zippin Neighborhood Dark Store.
            </h1>
            <p className="text-xs sm:text-sm text-amber-50 font-medium leading-relaxed max-w-xl">
              Partner with India's fastest growing 10-minute grocery network. Generate predictable monthly returns powered by our proprietary picking technology and guaranteed demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">📈</span>
              <h3 className="font-bold text-sm text-gray-900">High ROI & Margins</h3>
              <p className="text-xs text-gray-500">18%–24% annualized ROI with proven operating models.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">🤖</span>
              <h3 className="font-bold text-sm text-gray-900">Full Tech Automation</h3>
              <p className="text-xs text-gray-500">Auto-replenishment, barcode hand-held picking, and live billing.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">📦</span>
              <h3 className="font-bold text-sm text-gray-900">Guaranteed Inventory</h3>
              <p className="text-xs text-gray-500">Direct supply from FMCG brands at wholesale manufacturer rates.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Apply for a Franchise License</h2>
              <p className="text-xs text-gray-500 mt-1">Fill out your details to receive the comprehensive Franchise Information Memorandum.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="text-base font-bold text-gray-900">Application Submitted!</h3>
                <p className="text-xs text-gray-600">Our franchise expansion team will connect with you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 11111"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target City</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Delhi NCR, Bengaluru"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Locality / Area</label>
                    <input
                      type="text"
                      required
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="e.g. Sector 56, Indiranagar"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Investment Capacity</label>
                    <select
                      value={form.investment}
                      onChange={(e) => setForm({ ...form, investment: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="₹15L - ₹25L">₹15L – ₹25L</option>
                      <option value="₹25L - ₹50L">₹25L – ₹50L</option>
                      <option value="₹50L+">₹50L+ (Multi-hub)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-8 py-3 rounded-xl shadow transition-all active:scale-95"
                >
                  Submit Franchise Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
