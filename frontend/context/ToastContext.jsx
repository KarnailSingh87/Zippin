import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext({});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, opts = {}) => {
    setToast({ message, ...opts });
    const duration = opts.duration || 2200;
    if (typeof window !== "undefined") {
      window.setTimeout(() => setToast(null), duration);
    }
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
