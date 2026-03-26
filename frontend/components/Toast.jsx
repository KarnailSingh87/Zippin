import React from "react";
import { useToast } from "../context/ToastContext";

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-60">
      <div className="bg-black/90 text-white px-4 py-2 rounded-xl shadow-lg animate-fade-in"> 
        <div className="text-sm font-medium">{toast.message}</div>
      </div>
    </div>
  );
}
