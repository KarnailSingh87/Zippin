import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// Map product category/title keywords to emojis for better visual placeholders
const PRODUCT_EMOJIS = {
  tomato: "🍅",
  onion: "🧅",
  potato: "🥔",
  capsicum: "🫑",
  banana: "🍌",
  apple: "🍎",
  cucumber: "🥒",
  milk: "🥛",
  curd: "🥛",
  butter: "🧈",
  bread: "🍞",
  corn: "🌽",
  chips: "🍟",
  lays: "🍟",
  kurkure: "🍘",
  bhujia: "🥜",
  popcorn: "🍿",
  coca: "🥤",
  cola: "🥤",
  juice: "🧃",
  water: "💧",
  noodles: "🍜",
  maggi: "🍜",
  fries: "🍟",
  tea: "🍵",
  coffee: "☕",
  bournvita: "🥤",
  biscuit: "🍪",
  parle: "🍪",
  oreo: "🍪",
  atta: "🌾",
  rice: "🍚",
  dal: "🫘",
  chocolate: "🍫",
  silk: "🍫",
  gulab: "🧁",
  kitkat: "🍫",
  vim: "🧴",
  harpic: "🧹",
  surf: "🧺",
  colgate: "🪥",
  shampoo: "🧴",
  dettol: "🧼",
  paper: "🧃",
};

function getProductEmoji(title) {
  const lower = title.toLowerCase();
  for (const [key, emoji] of Object.entries(PRODUCT_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "📦";
}

function StarRating({ rating, count }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <div className="flex items-center gap-0.5 bg-green-700 text-white text-[9px] font-bold px-1.5 py-[1px] rounded">
        <span>{rating.toFixed(1)}</span>
        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      {count > 0 && (
        <span className="text-[9px] text-gray-400">
          ({count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count})
        </span>
      )}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem, removeItem, getQty } = useCart();
  const { showToast } = useToast();
  const qty = getQty(product._id);
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.mrp) * 100)
    : 0;
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.images?.[0]?.url;
  const showImage = imageUrl && !imgError && !imageUrl.includes("placehold.co");

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all duration-200 flex flex-col group relative">
      {/* Discount badge */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {discountPercent}% OFF
        </div>
      )}

      {/* Image */}
      <div className="relative bg-gray-50 p-3 flex items-center justify-center aspect-square overflow-hidden">
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <span className="text-5xl">
              {getProductEmoji(product.title || "")}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Delivery time badge */}
        <div className="flex items-center gap-1 mb-1">
          <svg
            className="w-3 h-3 text-blinkit-green"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-[10px] font-semibold text-gray-500">
            10 MINS
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 leading-snug min-h-[2.5em]">
          {product.title}
        </h3>

        {/* Unit */}
        {product.unit && (
          <span className="text-[11px] text-gray-400 mb-1">{product.unit}</span>
        )}

        {/* Star Rating */}
        <StarRating rating={product.rating} count={product.ratingCount} />

        <div className="mt-auto flex items-end justify-between gap-1">
          {/* Price */}
          <div>
            <div className="text-sm font-bold text-gray-900">
              ₹{product.price}
            </div>
            {hasDiscount && (
              <div className="text-[11px] text-gray-400 line-through">
                ₹{product.mrp}
              </div>
            )}
          </div>

          {/* Add / Quantity button */}
          {qty === 0 ? (
            <button
              onClick={() => { addItem(product); if (showToast) showToast(`Added to cart — ${product.title}`); }}
              className="border-2 border-blinkit-green text-blinkit-green rounded-lg px-3 py-1 text-xs font-bold hover:bg-blinkit-green hover:text-white transition-colors active:scale-95"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-blinkit-green rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => removeItem(product._id)}
                className="text-white w-7 h-7 flex items-center justify-center hover:bg-blinkit-green-dark transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="text-white w-6 text-center text-xs font-bold">
                {qty}
              </span>
              <button
                onClick={() => addItem(product)}
                className="text-white w-7 h-7 flex items-center justify-center hover:bg-blinkit-green-dark transition-colors text-lg font-bold"
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
