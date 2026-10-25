import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function LeadPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: "", contactName: "", email: "", phone: "", requirement: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ company: "", contactName: "", email: "", phone: "", requirement: "" });
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Zippin for Business & Bulk Corporate Supply | Lead Partnership</title>
        <meta
          name="description"
          content="Power your office pantry, corporate gifting, and bulk institutional grocery orders with Zippin Enterprise."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Business & Bulk Orders</span>
          </div>

          <div className="bg-gradient-to-r from-emerald-800 to-green-950 text-white rounded-3xl p-8 sm:p-12 shadow-md">
            <div className="max-w-xl space-y-3">
              <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Enterprise & Corporate
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Superfast supply for offices, cafes & institutions.
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                Automate your daily office pantry essentials, coffee beans, snacks, dairy, and corporate gifting hampers with custom GST billing, credit terms, and dedicated account managers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2 text-center">
              <span className="text-3xl">☕</span>
              <h3 className="font-bold text-sm text-gray-900">Office Pantry Supplies</h3>
              <p className="text-xs text-gray-500">Scheduled daily milk, tea, coffee, and healthy snack refills.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2 text-center">
              <span className="text-3xl">🎁</span>
              <h3 className="font-bold text-sm text-gray-900">Festive Bulk Gifting</h3>
              <p className="text-xs text-gray-500">Custom sweet boxes, dry fruit hampers, and chocolates for teams.</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2 text-center">
              <span className="text-3xl">🧾</span>
              <h3 className="font-bold text-sm text-gray-900">Input GST Invoicing</h3>
              <p className="text-xs text-gray-500">Full tax compliance, monthly consolidated billing, and volume savings.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Request Enterprise Pricing & Call</h2>
              <p className="text-xs text-gray-500 mt-1">Our corporate accounts team will contact you within 2 hours.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="text-base font-bold text-gray-900">Inquiry Received!</h3>
                <p className="text-xs text-gray-600">A dedicated Zippin Enterprise manager has been assigned to your request.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g. Acme Technologies Pvt Ltd"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Person Name</label>
                    <input
                      type="text"
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      placeholder="e.g. Priya Nair"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="priya@acme.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Monthly Requirement / Details</label>
                  <textarea
                    rows={3}
                    required
                    value={form.requirement}
                    onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                    placeholder="Describe requirement (e.g. Daily dairy & pantry supplies for 250 employees in Gurugram)..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-8 py-3 rounded-xl shadow transition-all active:scale-95"
                >
                  Submit Enterprise Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
