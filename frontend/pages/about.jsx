import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Zippin - 10-Minute Instant Grocery Delivery</title>
        <meta
          name="description"
          content="Learn about Zippin, India's leading ultrafast grocery delivery service. Delivering groceries, fresh vegetables, snacks, and daily essentials in 8-10 minutes."
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
            <span className="text-gray-900 font-bold">About Us</span>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-[#0C831F] via-[#09701a] to-[#044c10] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-block bg-[#F8CB46] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Our Story & Vision
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Everything delivered in 8–10 minutes.
              </h1>
              <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
                Zippin is pioneering the future of quick commerce in India. We combine deep neighborhood dark store networks, state-of-the-art predictive inventory tech, and an empowered delivery fleet to bring you what you need, right when you need it.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-15 translate-x-10 translate-y-10 pointer-events-none">
              <span className="text-[200px]">⚡</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#0C831F]">8-10 min</div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Avg Delivery Time</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-gray-900">10,000+</div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Products Available</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-gray-900">6</div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Dark Stores Across NCR & BLR</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#0C831F]">99.4%</div>
              <div className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">On-Time Accuracy</div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">How Zippin Works</h2>
              <p className="text-xs text-gray-500 mt-1">Our recipe for lightning speed without compromising safety.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <span className="text-3xl">🏬</span>
                <h3 className="font-bold text-base text-gray-900">Neighborhood Dark Stores</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We position automated micro-fulfillment centers within 2 km of your home. Orders are packed in under 2 minutes by our trained picking team.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                <span className="text-3xl">🥦</span>
                <h3 className="font-bold text-base text-gray-900">Direct Farm Freshness</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fresh vegetables, fruits, and dairy arrive daily at 4 AM directly from verified farms and APMC mandis with strict quality grading checks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <span className="text-3xl">🛵</span>
                <h3 className="font-bold text-base text-gray-900">Rider Safety & Well-being</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Our delivery partners never speed. Superfast delivery happens because the dark store is around your block, not because drivers rush.
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-[#FFE141] rounded-3xl p-8 text-center space-y-4 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Ready to experience instant delivery?</h2>
            <p className="text-sm text-gray-700 max-w-xl mx-auto font-medium">
              Join millions of happy customers getting fresh groceries, milk, snacks, and daily household items delivered in minutes.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                href="/"
                className="bg-[#0C831F] text-white px-6 py-3 rounded-xl font-bold text-sm shadow hover:bg-[#0a701b] transition-all hover:scale-105"
              >
                Shop Now
              </Link>
              <Link
                href="/careers"
                className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all hover:scale-105"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
