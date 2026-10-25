import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function WarehousePage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ owner: "", phone: "", address: "", sqft: "2,500 - 3,500 sq ft", floor: "Ground Floor" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ owner: "", phone: "", address: "", sqft: "2,500 - 3,500 sq ft", floor: "Ground Floor" });
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Warehouse & Property Partner | Lease Store Facilities to Zippin</title>
        <meta
          name="description"
          content="Monetize your commercial real estate. Lease 2,000–4,000 sq ft properties to Zippin for long-term rental income."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Warehouse Real Estate Partner</span>
          </div>

          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-3">
            <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Real Estate Partnerships
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Rent your property to Zippin.
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed max-w-xl">
              We are actively looking for ground-floor commercial spaces (2,000 to 4,500 sq ft) across Delhi NCR and Bengaluru with long-term 5 to 9 year lease agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">🏢</span>
              <h3 className="font-bold text-sm text-gray-900">Guaranteed Rental</h3>
              <p className="text-xs text-gray-500">On-time rent deposits with institutional tenant reliability.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">📄</span>
              <h3 className="font-bold text-sm text-gray-900">5-9 Year Leases</h3>
              <p className="text-xs text-gray-500">Long-term contracts with built-in escalation clauses.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-2">
              <span className="text-3xl">⚡</span>
              <h3 className="font-bold text-sm text-gray-900">Fast Approvals</h3>
              <p className="text-xs text-gray-500">Property inspection and lease signing completed in under 7 days.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Submit Your Property</h2>
              <p className="text-xs text-gray-500 mt-1">Our real estate acquisition team will review your property location and schedule a site visit.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="text-base font-bold text-gray-900">Property Details Submitted!</h3>
                <p className="text-xs text-gray-600">Our regional expansion lead will call you to schedule a site verification.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Owner / Broker Name</label>
                    <input
                      type="text"
                      required
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                      placeholder="e.g. Rajesh Mehra"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98110 00000"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Carpet Area (sq ft)</label>
                    <select
                      value={form.sqft}
                      onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="1,500 - 2,500 sq ft">1,500 – 2,500 sq ft</option>
                      <option value="2,500 - 3,500 sq ft">2,500 – 3,500 sq ft</option>
                      <option value="3,500 - 5,000 sq ft">3,500 – 5,000 sq ft</option>
                      <option value="5,000+ sq ft">5,000+ sq ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Floor Level</label>
                    <select
                      value={form.floor}
                      onChange={(e) => setForm({ ...form, floor: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="Ground Floor">Ground Floor (Preferred)</option>
                      <option value="Basement with ramp access">Basement with ramp access</option>
                      <option value="First Floor with freight lift">First Floor with freight lift</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Complete Address & Landmark</label>
                  <textarea
                    rows={2}
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. Plot No. 42, Main Market, Sector 43, Gurugram (Near Metro Station)"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-8 py-3 rounded-xl shadow transition-all active:scale-95"
                >
                  Submit Property for Review
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
