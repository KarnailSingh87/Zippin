import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addItem, removeItem, getQty } = useCart();
  const { showToast } = useToast();
  const qty = getQty(product._id);
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-3 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-200 flex flex-col justify-between group relative">
      {/* Top row: Discount & Delivery Time */}
      <div className="flex items-center justify-between gap-1 mb-1">
        {discountPercent > 0 ? (
          <span className="bg-[#256FEF] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md tracking-tight uppercase shadow-xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1 bg-gray-100/90 text-gray-600 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
          <svg className="w-2.5 h-2.5 text-[#0C831F]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>8 MINS</span>
        </div>
      </div>

      {/* Product Image Area */}
      <div className="relative w-full aspect-square flex items-center justify-center p-2 overflow-hidden my-1">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 select-none"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl text-3xl">
            🛍️
          </div>
        )}
      </div>

      {/* Title & Unit */}
      <div className="flex-1 flex flex-col mt-1">
        <h3
          title={product.title}
          className="text-xs sm:text-[13px] font-bold text-gray-900 line-clamp-2 leading-snug min-h-[2.6em] group-hover:text-[#0C831F] transition-colors"
        >
          {product.title}
        </h3>

        <div className="text-[11px] font-medium text-gray-500 mt-1 mb-2">
          {product.unit || "1 unit"}
        </div>

        {/* Pricing & Add Button */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-1.5 border-t border-gray-100">
          <div>
            <div className="text-sm sm:text-base font-black text-gray-900 leading-none">
              ₹{product.price}
            </div>
            {hasDiscount && (
              <div className="text-[11px] text-gray-400 line-through leading-none mt-1">
                ₹{product.mrp}
              </div>
            )}
          </div>

          {/* ADD / Quantity Counter Button */}
          {qty === 0 ? (
            <button
              onClick={() => {
                addItem(product);
                if (showToast) showToast(`Added to cart: ${product.title}`);
              }}
              className="border border-[#0C831F] text-[#0C831F] bg-[#F7FFF9] hover:bg-[#0C831F] hover:text-white font-black text-xs uppercase px-4 py-1.5 rounded-lg transition-all duration-150 active:scale-95 shadow-2xs"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-[#0C831F] text-white rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => removeItem(product._id)}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#0a6b19] font-black text-sm transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center text-xs font-black select-none">
                {qty}
              </span>
              <button
                onClick={() => addItem(product)}
                className="w-7 h-7 flex items-center justify-center hover:bg-[#0a6b19] font-black text-sm transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
