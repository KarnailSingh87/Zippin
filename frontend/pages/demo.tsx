"use client"

import Head from "next/head"
import Link from "next/link"
import AddToBasket from "@/components/ui/motion-add-to-basket"
import DefaultDemo from "@/components/ui/demo"

export default function DemoPage() {
  return (
    <>
      <Head>
        <title>Motion Add to Basket Interactive Demo | Zippin</title>
        <meta
          name="description"
          content="Interactive physics-based arc animation for adding products to basket."
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#0C831F] text-xs font-bold uppercase tracking-wider mb-2">
            <span>✨</span> Motion React Component
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Animated "Add to Basket" Trajectory
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mt-1">
            Parabolic projectile curve animation using <code>motion/react</code> with
            tangent rotation, velocity bounce, and ripple ping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-center">
          {/* Default Component as specified in prompt */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col items-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Default (Campus 00s)
            </div>
            <AddToBasket />
          </div>

          {/* Grocery Product with Unsplash Stock Image */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col items-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Fresh Organic Avocados
            </div>
            <AddToBasket
              title="Fresh Hass Avocados (2 pcs)"
              price="₹185"
              image="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=320&q=80"
              direction="ccw"
              buttonText="Add to Cart 🥑"
            />
          </div>

          {/* Blinkit Fresh Milk Example */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col items-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Amul Taaza Toned Milk
            </div>
            <AddToBasket
              title="Amul Taaza Fresh Milk (500ml)"
              price="₹27"
              image="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=320&q=80"
              direction="cw"
              buttonText="Add to Cart 🥛"
            />
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0C831F] text-white font-bold text-sm hover:bg-[#0a731b] transition-all shadow-md shadow-emerald-900/20"
          >
            ← Back to Hamirpur Storefront
          </Link>
        </div>
      </div>
    </>
  )
}
