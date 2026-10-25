import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  function handleClick() {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 450);
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#0C831F]/50 cursor-pointer shadow-xs active:scale-90 group overflow-hidden ${
        isDark
          ? "bg-[#161b22] hover:bg-gray-800 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/40"
          : "bg-amber-50 hover:bg-amber-100 text-amber-500 border border-amber-200/90 shadow-amber-100/50"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode (Currently ${isDark ? "Dark" : "Light"})`}
    >
      {/* Ambient Radial Glow Backdrop inside the Circle */}
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none ${
          isDark
            ? "bg-gradient-to-tr from-emerald-600/25 via-emerald-500/10 to-transparent opacity-90"
            : "bg-gradient-to-tr from-amber-400/30 via-yellow-300/20 to-transparent opacity-95"
        }`}
      />

      {/* Sun Icon: Positioned perfectly inside the circle */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-out transform ${
          isDark
            ? "opacity-0 rotate-90 scale-40 pointer-events-none"
            : "opacity-100 rotate-0 scale-100"
        } ${isAnimating && !isDark ? "scale-110" : ""}`}
      >
        <svg
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-amber-500 drop-shadow-xs transition-transform duration-300 group-hover:rotate-45"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Moon Icon: Positioned perfectly inside the circle */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-350 ease-out transform ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-40 pointer-events-none"
        } ${isAnimating && isDark ? "scale-110" : ""}`}
      >
        <svg
          className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current text-white dark:text-emerald-400 drop-shadow-xs transition-transform duration-300 group-hover:-rotate-12"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </div>
    </button>
  );
}
