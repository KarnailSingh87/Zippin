import React from "react";
import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  const isWarning = toast.type === "warning" || toast.type === "warn";
  const isError = toast.type === "error";
  const isInfo = toast.type === "info";

  const bgClass = isWarning
    ? "bg-amber-600 border-amber-400/50"
    : isError
    ? "bg-rose-600 border-rose-400/50"
    : isInfo
    ? "bg-blue-600 border-blue-400/50"
    : "bg-[#0C831F] border-emerald-400/40";

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 animate-slide-up pointer-events-none max-w-sm w-full px-4 flex justify-center">
      <div
        className={`${bgClass} text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-black border tracking-wide select-none pointer-events-auto`}
      >
        <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black shrink-0">
          {isWarning ? "⚠️" : isError ? "✕" : isInfo ? "ℹ" : "✓"}
        </span>
        <span className="leading-tight">{toast.message}</span>
      </div>
    </div>
  );
}
