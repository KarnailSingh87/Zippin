import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function DownloadAppPage() {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const handleSendLink = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPhone("");
    }, 3500);
  };

  return (
    <>
      <Head>
        <title>Download Zippin App | iOS & Android 10-Minute Grocery App</title>
        <meta
          name="description"
          content="Get the official Zippin app on Apple App Store & Google Play. Experience ultrafast 8-10 minute grocery delivery on your smartphone."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Download App</span>
          </div>

          <div className="bg-gradient-to-br from-neutral-900 via-gray-900 to-black text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg z-10">
              <span className="bg-[#FFE141] text-black text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                ⚡ Mobile Experience
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                India's fastest grocery app in your pocket.
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed">
                Live delivery tracking, exclusive app-only flash sales, 1-tap reordering, and priority customer care.
              </p>

              {/* App Store & Google Play Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Zippin for iOS is opening in App Store!");
                  }}
                  className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-4 py-3 rounded-2xl cursor-pointer transition-all hover:scale-105 shadow-md"
                >
                  <svg className="w-6 h-6 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-1.03 2.78 1.02.08 2.12-.57 2.75-1.32z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[10px] uppercase tracking-wide opacity-80">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </a>

                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Zippin for Android is opening in Google Play Store!");
                  }}
                  className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-4 py-3 rounded-2xl cursor-pointer transition-all hover:scale-105 shadow-md"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186A2.257 2.257 0 0 1 3 20.6V3.4A2.257 2.257 0 0 1 3.609 1.814z"/>
                    <path fill="#34A853" d="M17.18 8.613l-3.388 3.388 3.388 3.387 3.824-2.173a1.444 1.444 0 0 0 0-2.43l-3.824-2.172z"/>
                    <path fill="#EA4335" d="M13.792 12L3.61 22.186c.642.68 1.62.83 2.476.344l11.094-6.303L13.792 12z"/>
                    <path fill="#FBBC05" d="M17.18 8.613L6.086 2.31A2.183 2.183 0 0 0 3.61 1.814L13.792 12l3.388-3.387z"/>
                  </svg>
                  <div className="text-left leading-tight">
                    <div className="text-[9px] uppercase tracking-wider opacity-80">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>

            {/* App Preview Graphic */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-3 shrink-0">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                <img
                  src="/images/zippin_favicon_white_512.png"
                  alt="Zippin App"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs font-black text-white">Scan QR or Get SMS Link</div>
              <p className="text-[11px] text-gray-300">Compatible with iOS 15+ & Android 9+</p>
            </div>
          </div>

          {/* SMS Link Form */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-lg font-black text-gray-900">Get a download link sent to your phone</h2>
            {sent ? (
              <p className="text-xs font-bold text-[#0C831F]">✓ Download link sent to +91 {phone}! Check your SMS messages.</p>
            ) : (
              <form onSubmit={handleSendLink} className="flex gap-2 max-w-md mx-auto">
                <div className="flex items-center border border-gray-300 rounded-xl px-3 bg-gray-50 text-xs font-bold text-gray-600">
                  +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition-all active:scale-95"
                >
                  Send Link
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
