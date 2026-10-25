import React, { useState, useEffect } from "react";

export default function ZipperAnnouncementBar({
  deliveryText = "Superfast Delivery in 8-10 Minutes | Free Delivery on orders above ₹199",
}) {
  // States: 'opening' | 'open' | 'closing' | 'closed'
  const [status, setStatus] = useState("closed");
  const [hasMounted, setHasMounted] = useState(false);

  // Trigger opening animation on mount
  useEffect(() => {
    setHasMounted(true);
    // Slight tick delay so browser registers initial 0-width clip-path before animating
    const timer = setTimeout(() => {
      setStatus("opening");
    }, 60);

    const openTimer = setTimeout(() => {
      setStatus("open");
    }, 850);

    return () => {
      clearTimeout(timer);
      clearTimeout(openTimer);
    };
  }, []);

  function handleClose() {
    if (status === "closing" || status === "closed") return;
    setStatus("closing");
    setTimeout(() => {
      setStatus("closed");
    }, 600);
  }

  function handleReopen() {
    if (status === "opening" || status === "open") return;
    setStatus("opening");
    setTimeout(() => {
      setStatus("open");
    }, 850);
  }

  const isRevealing = status === "opening";
  const isOpen = status === "open";
  const isRetracting = status === "closing";
  const isClosed = status === "closed";

  return (
    <>
      <style jsx>{`
        /* Opening: Left to Right smooth zipper reveal (0.75s ease-out) */
        .zipper-opening {
          clip-path: inset(0 0% 0 0);
          transition: clip-path 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Closing: Right to Left smooth zipper retraction (0.55s ease-in) */
        .zipper-closing {
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.55s cubic-bezier(0.7, 0, 0.84, 0);
        }

        .zipper-open {
          clip-path: inset(0 0% 0 0);
        }

        .zipper-closed {
          clip-path: inset(0 100% 0 0);
        }

        /* Moving metallic zipper slider head */
        .zipper-head-opening {
          left: 100%;
          transition: left 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .zipper-head-closing {
          left: 0%;
          transition: left 0.55s cubic-bezier(0.7, 0, 0.84, 0);
        }

        /* Subtle zipper teeth pattern along top & bottom edges */
        .zipper-teeth-top {
          background-image: repeating-linear-gradient(
            to right,
            rgba(0, 0, 0, 0.08) 0px,
            rgba(0, 0, 0, 0.08) 3px,
            transparent 3px,
            transparent 6px
          );
          height: 2px;
        }

        .zipper-teeth-bottom {
          background-image: repeating-linear-gradient(
            to right,
            rgba(0, 0, 0, 0.06) 0px,
            rgba(0, 0, 0, 0.06) 3px,
            transparent 3px,
            transparent 6px
          );
          height: 2px;
        }
      `}</style>

      {/* Main Container Wrapper */}
      <div className="relative w-full overflow-hidden transition-all duration-300 z-40">
        {/* Reopen mini pill when retracted/closed */}
        {isClosed && (
          <div className="bg-[#F8CB46]/30 py-1 px-4 text-center border-b border-yellow-300/40 flex items-center justify-center animate-fade-in">
            <button
              onClick={handleReopen}
              title="Click to unzip announcement"
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F8CB46] hover:bg-[#f5c226] text-gray-900 text-[11px] font-bold border border-yellow-400 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span className="text-xs">⚡</span>
              <span>Unzip Announcement</span>
              <span className="text-[10px] bg-white/70 px-1 rounded text-gray-700">↺</span>
            </button>
          </div>
        )}

        {/* The Animated Zipper Banner Bar */}
        <div
          className={`relative w-full bg-[#F8CB46] text-[#1C1C1C] border-b border-yellow-400/90 shadow-xs select-none ${
            isRevealing
              ? "zipper-opening"
              : isOpen
              ? "zipper-open"
              : isRetracting
              ? "zipper-closing"
              : "zipper-closed hidden"
          }`}
          style={{
            clipPath:
              status === "closed" && !hasMounted
                ? "inset(0 100% 0 0)"
                : undefined,
          }}
        >
          {/* Top Zipper Teeth Micro-Texture */}
          <div className="zipper-teeth-top w-full absolute top-0 left-0" />

          {/* Banner Contents */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
            {/* Center Content with Pill Badge & Delivery Text */}
            <div className="flex-1 flex items-center justify-center gap-2.5 sm:gap-3 whitespace-nowrap min-w-0">
              {/* Pill-shaped Badge: "FASTEST" in dark green on cream/off-white background */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FFFDF0] text-[#0C831F] text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs border border-amber-200/50 shrink-0">
                FASTEST
              </span>

              {/* Accompanying text with lightning bolt icon */}
              <div className="text-xs sm:text-[13px] font-bold tracking-tight text-[#1C1C1C] flex items-center gap-1.5 whitespace-nowrap truncate">
                <span className="text-amber-700 font-extrabold text-sm shrink-0">⚡</span>
                <span className="truncate">{deliveryText}</span>
              </div>
            </div>

            {/* Right: Sleek Metallic Zipper Puller / Close Tab */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1">
              {/* Interactive Zipper Pull Handle */}
              <button
                onClick={handleClose}
                title="Zip to close announcement"
                className="group flex items-center gap-1 bg-white/40 hover:bg-white/80 text-gray-800 rounded-md px-1.5 py-0.5 text-[10px] font-bold border border-yellow-500/30 transition-all cursor-pointer shadow-2xs active:scale-95"
                aria-label="Close banner"
              >
                {/* Miniature Metallic Zipper Puller Icon */}
                <span className="w-3.5 h-3.5 rounded-xs bg-gradient-to-b from-gray-200 to-gray-400 border border-gray-400 flex items-center justify-center text-[7px] text-gray-700 font-black shadow-xs">
                  ||
                </span>
                <span className="text-gray-700 group-hover:text-gray-900 text-[11px] font-bold">✕</span>
              </button>
            </div>
          </div>

          {/* Bottom Zipper Teeth Micro-Texture */}
          <div className="zipper-teeth-bottom w-full absolute bottom-0 left-0" />

          {/* Moving Metallic Zipper Slider Head on the advancing/retreating edge */}
          {(isRevealing || isRetracting) && (
            <div
              className={`absolute top-0 bottom-0 pointer-events-none z-50 flex flex-col items-center justify-center ${
                isRevealing
                  ? "zipper-head-opening"
                  : "zipper-head-closing"
              }`}
              style={{
                transform: "translateX(-50%)",
                left: isRevealing ? "100%" : "0%",
              }}
            >
              {/* Metallic Slider Body */}
              <div className="w-3 sm:w-3.5 h-[80%] rounded-xs bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 border border-gray-500/80 shadow-md flex items-center justify-center">
                <div className="w-[1px] h-3 bg-gray-500/60" />
              </div>
              {/* Dangling Zipper Pull Tab */}
              <div className="w-2.5 h-3.5 rounded-b-sm bg-gradient-to-b from-gray-300 to-gray-400 border border-gray-500 -mt-0.5 shadow-xs flex items-center justify-center">
                <div className="w-1 h-1.5 rounded-full bg-gray-600/40" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
