import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function DeliveryPartnerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "Delhi NCR", vehicle: "Motorcycle / Scooter" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", city: "Delhi NCR", vehicle: "Motorcycle / Scooter" });
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Deliver with Zippin | Earn up to ₹35,000/month as Delivery Partner</title>
        <meta
          name="description"
          content="Join Zippin as a delivery partner. Enjoy flexible working hours, weekly payouts, and medical insurance."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Deliver with Zippin</span>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 via-green-700 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-md space-y-3">
            <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Earn With Us
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Earn up to ₹35,000 every month.
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
              Be your own boss. Short delivery distances (under 2 km), guaranteed weekly payouts directly to your bank account, and ₹5,00,000 accidental insurance coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1.5">
              <span className="text-3xl">💵</span>
              <h3 className="font-bold text-sm text-gray-900">Weekly Payouts</h3>
              <p className="text-xs text-gray-500">Earnings credited every Tuesday</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1.5">
              <span className="text-3xl">⏰</span>
              <h3 className="font-bold text-sm text-gray-900">Flexible Shifts</h3>
              <p className="text-xs text-gray-500">Choose 4, 8, or 10-hour daily slots</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1.5">
              <span className="text-3xl">🛡️</span>
              <h3 className="font-bold text-sm text-gray-900">Free Insurance</h3>
              <p className="text-xs text-gray-500">₹5 Lakh medical & accidental cover</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 text-center space-y-1.5">
              <span className="text-3xl">🛵</span>
              <h3 className="font-bold text-sm text-gray-900">EV Bike Support</h3>
              <p className="text-xs text-gray-500">Don't have a bike? Rent an EV at ₹60/day</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Sign Up to Deliver Today</h2>
              <p className="text-xs text-gray-500 mt-1">Start delivering within 24 hours of document verification.</p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="text-base font-bold text-gray-900">Registration Initiated!</h3>
                <p className="text-xs text-gray-600">You will receive an SMS with a link to upload your Aadhaar and Driving License.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name (As per Aadhaar)</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Sunil Kumar"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Phone (WhatsApp enabled)</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City You Want to Deliver In</label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="Delhi NCR">Delhi NCR (Gurugram / Noida / Delhi)</option>
                      <option value="Bengaluru">Bengaluru (Indiranagar / Koramangala / HSR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle You Have</label>
                    <select
                      value={form.vehicle}
                      onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                    >
                      <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                      <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Need to Rent an EV">I need to rent an EV from Zippin</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-8 py-3 rounded-xl shadow transition-all active:scale-95"
                >
                  Join as Delivery Partner
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
