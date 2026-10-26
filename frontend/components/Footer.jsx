import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Guarantees Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-100">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
            <img
              src="/images/minute_delivery.png"
              alt="10 minute delivery"
              className="w-14 h-14 object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Superfast 10-Min Delivery</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Get your order delivered to your doorstep in minutes from our Hamirpur store.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
            <img
              src="/images/Best_Prices_Offers.png"
              alt="Best Prices & Offers"
              className="w-14 h-14 object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Best Prices & Offers</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Best price with direct manufacturer deals, bulk savings, and daily discounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]">
            <img
              src="/images/Wide_Assortment.png"
              alt="Wide Assortment"
              className="w-14 h-14 object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Wide Assortment</h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose from 10,000+ items across groceries, snacks, beverages, home & pet care.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
              Popular Categories
            </h5>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link href="/category/vegetables-fruits" className="hover:text-[#0C831F]">Vegetables & Fruits</Link></li>
              <li><Link href="/category/dairy-breakfast" className="hover:text-[#0C831F]">Dairy & Breakfast</Link></li>
              <li><Link href="/category/munchies" className="hover:text-[#0C831F]">Munchies & Chips</Link></li>
              <li><Link href="/category/cold-drinks-juices" className="hover:text-[#0C831F]">Cold Drinks & Juices</Link></li>
              <li><Link href="/category/instant-frozen-food" className="hover:text-[#0C831F]">Instant & Frozen Food</Link></li>
              <li><Link href="/category/tea-coffee-health" className="hover:text-[#0C831F]">Tea, Coffee & Health</Link></li>
              <li><Link href="/category/bakery-biscuits" className="hover:text-[#0C831F]">Bakery & Biscuits</Link></li>
              <li><Link href="/category/sweet-tooth" className="hover:text-[#0C831F]">Sweet Tooth & Ice Cream</Link></li>
              <li><Link href="/category/atta-rice-dal" className="hover:text-[#0C831F]">Atta, Rice & Dal</Link></li>
              <li><Link href="/category/pharma-wellness" className="hover:text-[#0C831F]">Pharma & Wellness</Link></li>
              <li><Link href="/category/pet-care" className="hover:text-[#0C831F]">Pet Care Store</Link></li>
              <li><Link href="/category/baby-care" className="hover:text-[#0C831F]">Baby Care Essentials</Link></li>
              <li><Link href="/category/paan-corner" className="hover:text-[#0C831F] font-bold text-emerald-800">🍃 Paan Corner</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
              Useful Links
            </h5>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link href="/about" className="hover:text-[#0C831F]">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-[#0C831F]">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-[#0C831F]">Zippin Blog</Link></li>
              <li><Link href="/press" className="hover:text-[#0C831F]">Press & Media</Link></li>
              <li><Link href="/lead" className="hover:text-[#0C831F]">Lead</Link></li>
              <li><Link href="/support" className="hover:text-[#0C831F]">Customer Support</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
              Partner with us
            </h5>
            <ul className="space-y-2 text-xs text-gray-600 font-medium">
              <li><Link href="/partner/franchise" className="hover:text-[#0C831F]">Franchise Opportunities</Link></li>
              <li><Link href="/partner/seller" className="hover:text-[#0C831F]">Seller Central</Link></li>
              <li><Link href="/partner/warehouse" className="hover:text-[#0C831F]">Warehouse Partner</Link></li>
              <li><Link href="/partner/delivery" className="hover:text-[#0C831F]">Deliver with Zippin</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-gray-900 text-xs tracking-wider uppercase mb-4">
              Download Zippin App
            </h5>
            <p className="text-xs text-gray-500 mb-3">
              Experience lightning-fast grocery delivery on your mobile phone.
            </p>
            <div className="space-y-2.5">
              <Link
                href="/download"
                className="flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                aria-label="Download on the App Store"
              >
                <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-1.03 2.78 1.02.08 2.12-.57 2.75-1.32z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase tracking-wide opacity-80 font-normal">Download on the</div>
                  <div className="text-sm font-semibold tracking-tight">App Store</div>
                </div>
              </Link>
              <Link
                href="/download"
                className="flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                aria-label="Get it on Google Play"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186A2.257 2.257 0 0 1 3 20.6V3.4A2.257 2.257 0 0 1 3.609 1.814z" />
                  <path fill="#34A853" d="M17.18 8.613l-3.388 3.388 3.388 3.387 3.824-2.173a1.444 1.444 0 0 0 0-2.43l-3.824-2.172z" />
                  <path fill="#EA4335" d="M13.792 12L3.61 22.186c.642.68 1.62.83 2.476.344l11.094-6.303L13.792 12z" />
                  <path fill="#FBBC05" d="M17.18 8.613L6.086 2.31A2.183 2.183 0 0 0 3.61 1.814L13.792 12l3.388-3.387z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[9px] uppercase tracking-wider opacity-80 font-medium">Get it on</div>
                  <div className="text-sm font-semibold tracking-tight">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Legal / Copyright */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} Zippin Technologies. All rights reserved.</p>
          <p className="text-center sm:text-right">
            “Zippin” is India's ultrafast 10-minute grocery delivery app.
          </p>
        </div>
      </div>
    </footer>
  );
}
