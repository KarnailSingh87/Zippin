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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white" onClick={onClose}>
      {/* Modal Card */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-3xl w-full overflow-hidden my-8 print:shadow-none print:border-none print:m-0 print:max-w-none" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-[#0c1017] border-b border-gray-100 dark:border-gray-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0C831F]"></span>
            <span className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
              Tax Invoice & Receipt • {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0C831F] hover:bg-[#096618] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 md:p-10 text-gray-800 font-sans print:p-4" id="printable-invoice">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0C831F] flex items-center justify-center p-2 text-white font-black text-2xl shadow-sm">
                z
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">zippin</h1>
                <p className="text-xs text-gray-500 font-medium">Zippin Quick Commerce Pvt. Ltd.</p>
                <p className="text-[11px] text-gray-400">GSTIN: 07AAECZ9821M1Z5 • FSSAI: 10019011006542</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-[#0C831F] border border-emerald-200 font-black text-xs uppercase tracking-wider rounded-lg mb-1">
                Original Tax Invoice
              </span>
              <p className="text-sm font-bold text-gray-800">{invoiceNumber}</p>
              <p className="text-xs text-gray-500">{orderDate}</p>
            </div>
          </div>

          {/* Billing & Fulfillment Info */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/80 rounded-2xl p-5 border border-gray-100 mb-6 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Delivered To</p>
              <p className="font-extrabold text-gray-900 text-sm">{order.customerName || "Customer"}</p>
              <p className="text-gray-600 font-medium mt-0.5">{order.customerPhone || "+91 98765 43210"}</p>
              <p className="text-gray-500 mt-1 leading-relaxed">
                {order.deliveryAddress?.addressLine || "Saket District Centre, Sector 43"}, {order.deliveryAddress?.city || "Gurugram"}, {order.deliveryAddress?.pincode || "122002"}
              </p>
            </div>

            <div className="text-right sm:text-left">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Fulfillment Details</p>
              <p className="font-bold text-gray-800">
                Fulfillment Hub: <span className="text-[#0C831F]">{order.store?.name || "Sector 43 Dark Store"}</span>
              </p>
              <p className="text-gray-600 mt-0.5">
                Delivery Mode: <span className="font-semibold text-gray-800">Superfast (8-10 Mins)</span>
              </p>
              <p className="text-gray-600 mt-0.5">
                Payment Method:{" "}
                <span className="font-bold uppercase text-gray-800">{order.paymentMethod || "UPI"}</span>
              </p>
              <p className="text-gray-600 mt-0.5">
                Payment Status:{" "}
                <span className="font-bold text-emerald-600 uppercase">
                  {order.paymentStatus || "COMPLETED"}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100/80 text-gray-600 font-bold border-b border-gray-200">
                  <th className="py-2.5 px-4 w-10 text-center">#</th>
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-3">Unit/Pack</th>
                  <th className="py-2.5 px-3 text-right">Price</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-7 h-7 rounded-md object-contain bg-white border border-gray-100 flex-shrink-0"
                          />
                        )}
                        <span className="font-bold text-gray-800">{item.title || item.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500">{item.unit || "1 pack"}</td>
                    <td className="py-2.5 px-3 text-right text-gray-600">₹{item.price}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-gray-800">{item.quantity || item.qty || 1}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-gray-900">
                      ₹{item.total || (item.price * (item.quantity || item.qty || 1))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="text-xs text-gray-400 max-w-xs">
              <p className="font-semibold text-gray-500 mb-1">Terms & Conditions:</p>
              <p>Goods once delivered in sealed condition are covered under Zippin 10-Minute Return & Refund policy. For support, contact support@zippin.in</p>
            </div>

            <div className="w-full sm:w-64 bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-gray-800">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Handling & Taxes (5%):</span>
                <span className="font-semibold text-gray-800">₹{tax}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-black text-gray-900">
                <span>Total Amount Paid:</span>
                <span className="text-[#0C831F]">₹{total}</span>
              </div>
            </div>
          </div>

          {/* Footer signature */}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-[11px] text-gray-400">
            <div>
              <p>This is a computer-generated tax invoice and requires no physical signature.</p>
              <p className="text-[10px] text-gray-300">Powered by Zippin Dark Store Logistics OS</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#0C831F]">Zippin Authorized Signatory</div>
              <div className="text-[10px] text-gray-400">Saket Operations Center</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
