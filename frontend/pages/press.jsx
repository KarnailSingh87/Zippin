import React from "react";
import Head from "next/head";
import Link from "next/link";

const RELEASES = [
  {
    title: "Zippin Launches High-Speed Quick Commerce Store Facility in Hamirpur",
    outlet: "The Economic Times",
    date: "October 2026",
    link: "#",
    tag: "Expansion",
  },
  {
    title: "How Zippin Achieved 99.4% On-Time Delivery with Neighborhood Micro-Fulfillment",
    outlet: "TechCrunch",
    date: "September 2026",
    link: "#",
    tag: "Logistics",
  },
  {
    title: "Zippin Introduces Zero-Emission Electric Delivery Fleet in South Delhi & Gurugram",
    outlet: "LiveMint",
    date: "August 2026",
    link: "#",
    tag: "Sustainability",
  },
  {
    title: "Instant Commerce Revolution: Direct Farmer Sourcing Reduces Food Waste by 40%",
    outlet: "YourStory",
    date: "July 2026",
    link: "#",
    tag: "Impact",
  },
];

export default function PressPage() {
  return (
    <>
      <Head>
        <title>Press & Media | Zippin News, Media Kit & Inquiries</title>
        <meta
          name="description"
          content="Official press releases, media coverage, and press contact details for Zippin Technologies."
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
            <span className="text-gray-900 font-bold">Press & Media</span>
          </div>

          {/* Hero */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Press Room
              </span>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Zippin in the News
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                Stay updated with the latest press releases, company announcements, industry reports, and media features.
              </p>
            </div>
            <div className="shrink-0 bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center space-y-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Press Contact</span>
              <p className="text-sm font-black text-gray-900">press@zippin.com</p>
              <p className="text-[11px] text-gray-500">For media queries only</p>
            </div>
          </div>

          {/* Press Coverage */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Featured Coverage & Press Releases</h2>
            <div className="grid grid-cols-1 gap-3">
              {RELEASES.map((r, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:border-[#0C831F] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {r.outlet}
                      </span>
                      <span className="text-[10px] font-bold text-[#0C831F]">• {r.tag}</span>
                      <span className="text-[10px] text-gray-400">• {r.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{r.title}</h3>
                  </div>
                  <span className="text-xs font-black text-[#0C831F] shrink-0">
                    Read article →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Kit Download */}
          <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black">Official Brand Assets & Media Kit</h3>
              <p className="text-xs text-gray-300 max-w-lg">
                Download high-resolution logos, product photography, brand guidelines, and executive headshots.
              </p>
            </div>
            <a
              href="/images/zippin_logo_blinkit_colours.png"
              download="zippin_brand_logo.png"
              className="bg-[#FFE141] text-black font-black text-xs px-6 py-3 rounded-xl hover:bg-yellow-400 transition-all shrink-0"
            >
              Download Media Kit (ZIP)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
