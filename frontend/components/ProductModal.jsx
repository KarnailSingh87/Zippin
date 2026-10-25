import React from "react";
import { useCart } from "../context/CartContext";

export default function ProductModal({ product, onClose }) {
  const { addItem, removeItem, getQty } = useCart();

  if (!product) return null;

  const qty = getQty(product._id);
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 animate-slide-up flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 p-6 bg-[#F8F9FC] flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-100 min-h-[340px]">
          {discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-[#256FEF] text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-tight shadow-xs z-10">
              {discountPercent}% OFF
            </div>
          )}

          <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center p-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-contain drop-shadow-sm select-none"
              />
            ) : (
              <span className="text-6xl">🛍️</span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 bg-white px-3.5 py-1 rounded-full shadow-xs border border-gray-100 text-xs font-bold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-[#0C831F] animate-ping" />
            <span>⚡ Delivery in 8 minutes</span>
          </div>
        </div>

        {/* Right: Details & Add to Cart */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category */}
            {product.category?.name && (
              <div className="text-[11px] font-bold text-[#0C831F] uppercase tracking-wider mb-1">
                {product.category.name}
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight">
              {product.title}
            </h2>

            {/* Pack Size / Unit */}
            <div className="text-xs font-semibold text-gray-500 mt-1 mb-4">
              {product.unit || "1 unit"}
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-2xl font-black text-gray-900">
                ₹{product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    ₹{product.mrp}
                  </span>
                  <span className="text-xs font-bold text-[#0C831F] bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save ₹{product.mrp - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Why Shop from Zippin Guarantee Box */}
            <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-gray-100 space-y-3 mb-6 text-xs">
              <div className="font-bold text-gray-900 uppercase text-[10px] tracking-wider">
                Why shop from Zippin?
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <span className="text-base shrink-0">⚡</span>
                <span className="font-medium">Superfast 8-10 minute delivery from Hamirpur Store</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <span className="text-base shrink-0">🏷️</span>
                <span className="font-medium">Best prices & direct manufacturer offers</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <span className="text-base shrink-0">🔄</span>
                <span className="font-medium">Hassle-free instant replacement guarantee</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
            <div className="text-left">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Price
              </div>
              <div className="text-lg font-black text-gray-900">
                ₹{product.price * (qty > 0 ? qty : 1)}
              </div>
            </div>

            {product.stock === 0 ? (
              <button
                disabled
                className="flex-1 bg-gray-100 border border-gray-300 text-gray-400 py-3 px-6 rounded-xl font-bold text-sm uppercase cursor-not-allowed text-center"
              >
                out of stock
              </button>
            ) : qty === 0 ? (
              <button
                onClick={() => {
                  addItem(product);
                }}
                className="flex-1 bg-[#0C831F] hover:bg-[#0a701b] text-white py-3 px-6 rounded-xl font-black text-sm uppercase shadow-md active:scale-95 transition-all text-center"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-between bg-[#0C831F] text-white rounded-xl py-2 px-4 shadow-sm">
                <button
                  onClick={() => removeItem(product._id)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#0a6b19] font-black text-lg transition-colors active:scale-90"
                >
                  −
                </button>
                <div className="text-center font-black text-sm">
                  {qty} in Cart
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-[#0a6b19] font-black text-lg transition-colors active:scale-90"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
