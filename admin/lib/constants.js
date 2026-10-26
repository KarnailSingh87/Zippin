/**
 * Shared System Constants for Admin Portal
 */

export const ORDER_STATUS_CONFIG = {
  all: {
    label: "All Orders",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    dot: "bg-gray-400",
  },
  placed: {
    label: "Order Placed",
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  picking: {
    label: "Picking / Packing",
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
};

export const RIDER_STATUS_CONFIG = {
  available: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Available",
  },
  busy: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "On Delivery",
  },
  offline: {
    bg: "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
    label: "Offline",
  },
};

export const PICKER_STATUS_CONFIG = {
  available: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Idle / Ready",
  },
  busy: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Picking Bag",
  },
  offline: {
    bg: "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    text: "text-gray-600 dark:text-gray-400",
    dot: "bg-gray-400",
    label: "Off Shift",
  },
};
