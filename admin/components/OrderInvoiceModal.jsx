import React, { useRef } from "react";

export default function OrderInvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber || order._id?.slice(-6)?.toUpperCase()}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsSubtotal = (order.items || []).reduce(
    (acc, i) => acc + (Number(i.price || 0) * Number(i.quantity || i.qty || 1)),
    0
  );
  const subtotal = itemsSubtotal > 0 ? itemsSubtotal : (Number(order.subtotal) || Number(order.total) || 0);
  const deliveryFee = Number(order.deliveryFee) || (subtotal >= 199 ? 0 : 25);
  const tax = Number(order.tax) || 0;
  const total = subtotal + deliveryFee + tax;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden print:p-0 print:bg-white"
      onClick={onClose}
    >
      {/* Modal Card - Compact single-frame container */}
      <div
        className="bg-white dark:bg-[#121212] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto print:shadow-none print:border-none print:m-0 print:max-w-none print:max-h-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-[#0c1017] border-b border-gray-100 dark:border-gray-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0C831F]"></span>
            <span className="font-extrabold text-xs text-gray-800 dark:text-gray-200">
              Tax Invoice & Receipt • {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0C831F] hover:bg-[#096618] text-white font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          className="p-4 sm:p-5 text-gray-800 dark:text-gray-100 font-sans overflow-y-auto print:overflow-visible print:p-4 print:text-black space-y-3"
          id="printable-invoice"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-800 pb-3 print:border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0C831F] flex items-center justify-center text-white font-black text-lg shadow-xs">
                z
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-tight print:text-black">
                  zippin
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-tight print:text-gray-600">
                  Zippin Quick Commerce Pvt. Ltd.
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight print:text-gray-500">
                  GSTIN: 07AAECZ9821M1Z5 • FSSAI: 10019011006542
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#0C831F] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-extrabold text-[10px] uppercase tracking-wider rounded-md mb-0.5 print:bg-emerald-50 print:text-[#0C831F]">
                Original Tax Invoice
              </span>
              <p className="text-xs font-bold text-gray-900 dark:text-white print:text-black leading-tight">
                {invoiceNumber}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 print:text-gray-600 leading-tight">
                {orderDate}
              </p>
            </div>
          </div>

          {/* Billing & Fulfillment Info */}
          <div className="grid grid-cols-2 gap-3 bg-gray-50/80 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-[11px] print:bg-gray-50 print:border-gray-200">
            <div>
              <p className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-400 tracking-wider">
                Delivered To
              </p>
              <p className="font-extrabold text-gray-900 dark:text-white text-xs print:text-black">
                {order.customerName || "Customer"}
              </p>
              <p className="text-gray-600 dark:text-gray-300 font-medium text-[11px] print:text-gray-600">
                {order.customerPhone || "+91 98765 43210"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2 print:text-gray-500 text-[10px]">
                {order.deliveryAddress?.addressLine || order.deliveryAddress?.street || "Main Bazaar, Near Gandhi Chowk"}, {order.deliveryAddress?.city || "Hamirpur"}, {order.deliveryAddress?.pincode || "177001"}
              </p>
            </div>

            <div className="text-right sm:text-left">
              <p className="text-[9px] uppercase font-bold text-gray-400 dark:text-gray-400 tracking-wider">
                Fulfillment Details
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-200 print:text-black">
                Store: <span className="text-[#0C831F] dark:text-emerald-400 font-bold">{order.store?.name || "Zippin Store #501 - Hamirpur Hub"}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5 print:text-gray-600">
                Delivery Mode: <span className="font-medium text-gray-900 dark:text-white print:text-black">Superfast (8-10 Mins)</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5 print:text-gray-600">
                Payment: <span className="font-bold uppercase text-gray-900 dark:text-white print:text-black">{order.paymentMethod || "UPI"}</span> • <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{order.paymentStatus || "COMPLETED"}</span>
              </p>
            </div>
          </div>

          {/* Items Table - Contained with scroll for multi-item orders */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden max-h-44 overflow-y-auto print:max-h-none print:overflow-visible print:border-gray-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-200 dark:border-gray-800 text-[11px] print:bg-gray-100 print:text-gray-600">
                  <th className="py-1.5 px-3 w-8 text-center">#</th>
                  <th className="py-1.5 px-3">Item Description</th>
                  <th className="py-1.5 px-2">Unit/Pack</th>
                  <th className="py-1.5 px-2 text-right">Price</th>
                  <th className="py-1.5 px-2 text-center">Qty</th>
                  <th className="py-1.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 print:divide-gray-100">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="py-1.5 px-3 text-center text-gray-400 dark:text-gray-500 font-medium text-[11px]">{idx + 1}</td>
                    <td className="py-1.5 px-3">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-6 h-6 rounded object-contain bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shrink-0"
                          />
                        )}
                        <span className="font-bold text-gray-900 dark:text-white print:text-black text-xs line-clamp-1">{item.title || item.name}</span>
                      </div>
                    </td>
                    <td className="py-1.5 px-2 text-gray-600 dark:text-gray-400 text-[11px]">{item.unit || "1 pack"}</td>
                    <td className="py-1.5 px-2 text-right text-gray-700 dark:text-gray-300 text-[11px]">₹{item.price}</td>
                    <td className="py-1.5 px-2 text-center font-bold text-gray-900 dark:text-white print:text-black text-[11px]">{item.quantity || item.qty || 1}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-gray-900 dark:text-white print:text-black text-xs">
                      ₹{item.total || (item.price * (item.quantity || item.qty || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary & Terms */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
              <p className="font-bold text-gray-700 dark:text-gray-300 mb-0.5">Terms & Conditions:</p>
              <p>Goods once delivered in sealed condition are covered under Zippin 10-Minute Return & Refund policy. For support, contact support@zippin.in</p>
            </div>

            <div className="w-full sm:w-60 bg-gray-50 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-100 dark:border-gray-800 space-y-1 text-xs print:bg-gray-50 print:border-gray-200">
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-[11px]">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-[11px]">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">
                  {deliveryFee === 0 ? <span className="text-emerald-600 dark:text-emerald-400">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-[11px]">
                <span>CGST (2.5%):</span>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">₹{(tax / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400 text-[11px]">
                <span>SGST (2.5%):</span>
                <span className="font-semibold text-gray-900 dark:text-white print:text-black">₹{(tax / 2).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-1.5 flex justify-between text-xs font-black text-gray-900 dark:text-white print:text-black">
                <span>Total Amount Paid:</span>
                <span className="text-[#0C831F] dark:text-emerald-400 text-sm">₹{total}</span>
              </div>
            </div>
          </div>

          {/* Footer signature */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-2.5 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
            <div>
              <p>This is a computer-generated tax invoice and requires no physical signature.</p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500">Powered by Zippin Store Logistics OS</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#0C831F] dark:text-emerald-400">Zippin Authorized Signatory</div>
              <div className="text-[9px] text-gray-500 dark:text-gray-400">Hamirpur Operations Center</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
