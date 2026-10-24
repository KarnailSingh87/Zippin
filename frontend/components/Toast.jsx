import React from "react";
import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50 animate-slide-up pointer-events-none">
      <div className="bg-[#0C831F] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black border border-emerald-400/40 tracking-wide">
        <span className="w-4 h-4 rounded-full bg-white text-[#0C831F] flex items-center justify-center text-[10px] font-black">
          ✓
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
