import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const JOBS = [
  {
    id: "eng-1",
    title: "Senior Full Stack Engineer (Node.js & Next.js)",
    dept: "Engineering",
    location: "Gurugram, HR (Hybrid)",
    type: "Full-Time",
    desc: "Build mission-critical quick-commerce logistics routing algorithms and ultra-responsive consumer apps.",
  },
  {
    id: "eng-2",
    title: "Lead Inventory & Dispatch Systems Architect",
    dept: "Engineering",
    location: "Bengaluru, KA",
    type: "Full-Time",
    desc: "Scale our real-time stock sync engine handling millions of transactions per minute across our fulfillment platform.",
  },
  {
    id: "ops-1",
    title: "Store Operations Hub Manager",
    dept: "Operations",
    location: "Hamirpur Branch, HP",
    type: "Full-Time",
    desc: "Oversee daily picking, stock auditing, order dispatch SLA, and team leadership in high-velocity hubs.",
  },
  {
    id: "ops-2",
    title: "Regional Logistics & Fleet Lead",
    dept: "Operations",
    location: "Hamirpur & HP North",
    type: "Full-Time",
    desc: "Manage rider fleet allocation, store coverage geofencing, and delivery partner community success.",
  },
  {
    id: "cat-1",
    title: "Category Manager - Fresh Fruits & Vegetables",
    dept: "Category Management",
    location: "Gurugram, HR",
    type: "Full-Time",
    desc: "Direct farmer partnerships, cold chain fulfillment, margin optimization, and seasonal assortment planning.",
  },
  {
    id: "cat-2",
    title: "Brand Partnership Lead (FMCG & D2C)",
    dept: "Category Management",
    location: "Bengaluru, KA",
    type: "Full-Time",
    desc: "Partner with top consumer brands to launch exclusive instant-commerce product drops and ad placements.",
  },
];

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [appliedJob, setAppliedJob] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", resume: "" });

  const filteredJobs = selectedDept === "All" ? JOBS : JOBS.filter((j) => j.dept === selectedDept);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAppliedJob(null);
      setFormData({ name: "", email: "", phone: "", resume: "" });
    }, 2500);
  };

  return (
    <>
      <Head>
        <title>Careers at Zippin | Build India's Fastest Delivery Network</title>
        <meta
          name="description"
          content="Join the team reinventing commerce. Explore engineering, operations, and product roles at Zippin."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Careers</span>
          </div>

          {/* Hero */}
          <div className="bg-gradient-to-r from-neutral-900 to-gray-800 text-white rounded-3xl p-8 sm:p-12 shadow-md">
            <div className="max-w-2xl space-y-3">
              <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                We're Hiring
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Build the speed engine of modern commerce.
              </h1>
              <p className="text-sm text-gray-300 font-medium leading-relaxed">
                We are solving some of the hardest logistics, robotics, and real-time data challenges in the world. Join a team obsessed with craft, velocity, and customer delight.
              </p>
            </div>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {["All", "Engineering", "Operations", "Category Management"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDept === dept
                    ? "bg-[#0C831F] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">
              Open Positions ({filteredJobs.length})
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0C831F] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#0C831F]">
                        {job.dept}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">• {job.type}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 font-medium max-w-xl">{job.desc}</p>
                    <div className="text-xs font-semibold text-gray-600 flex items-center gap-1 pt-1">
                      <span>📍</span> {job.location}
                    </div>
                  </div>

                  <button
                    onClick={() => setAppliedJob(job)}
                    className="shrink-0 bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal application form */}
          {appliedJob && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative">
                <button
                  onClick={() => setAppliedJob(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  ✕
                </button>

                {submitted ? (
                  <div className="text-center py-8 space-y-3">
                    <span className="text-5xl">🎉</span>
                    <h3 className="text-xl font-black text-gray-900">Application Received!</h3>
                    <p className="text-xs text-gray-600">
                      Thank you for applying for <strong>{appliedJob.title}</strong>. Our recruiting team will review your profile and reach out within 48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#0C831F] uppercase tracking-wider">Apply for</span>
                      <h3 className="text-lg font-black text-gray-900 leading-snug">{appliedJob.title}</h3>
                      <p className="text-xs text-gray-500">{appliedJob.location}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                          placeholder="e.g. Rahul Sharma"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                            placeholder="rahul@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn / Resume Portfolio URL</label>
                        <input
                          type="url"
                          required
                          value={formData.resume}
                          onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0C831F] hover:bg-[#0a701b] text-white font-bold text-xs py-3 rounded-xl shadow transition-all active:scale-95"
                    >
                      Submit Application
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
