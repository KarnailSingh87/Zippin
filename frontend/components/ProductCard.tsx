import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface Props {
  product: any;
}

// Map product category/title keywords to emojis for better visual placeholders
const PRODUCT_EMOJIS: Record<string, string> = {
  'tomato': '🍅', 'onion': '🧅', 'potato': '🥔', 'capsicum': '🫑', 'banana': '🍌',
  'apple': '🍎', 'cucumber': '🥒', 'milk': '🥛', 'curd': '🥛', 'butter': '🧈',
  'bread': '🍞', 'corn': '🌽', 'chips': '🍟', 'lays': '🍟', 'kurkure': '🍘',
  'bhujia': '🥜', 'popcorn': '🍿', 'coca': '🥤', 'cola': '🥤', 'juice': '🧃',
  'water': '💧', 'noodles': '🍜', 'maggi': '🍜', 'fries': '🍟', 'tea': '🍵',
  'coffee': '☕', 'bournvita': '🥤', 'biscuit': '🍪', 'parle': '🍪', 'oreo': '🍪',
  'atta': '🌾', 'rice': '🍚', 'dal': '🫘', 'chocolate': '🍫', 'silk': '🍫',
  'gulab': '🧁', 'kitkat': '🍫', 'vim': '🧴', 'harpic': '🧹', 'surf': '🧺',
  'colgate': '🪥', 'shampoo': '🧴', 'dettol': '🧼', 'paper': '🧃',
};

function getProductEmoji(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, emoji] of Object.entries(PRODUCT_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '📦';
}

export default function ProductCard({ product }: Props) {
  const { addItem, removeItem, getQty } = useCart();
  const qty = getQty(product._id);
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.mrp) * 100) : 0;
  const [imgError, setImgError] = useState(false);
  
  const imageUrl = product.images?.[0]?.url;
  const showImage = imageUrl && !imgError;

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
            <span className="text-5xl">{getProductEmoji(product.title || '')}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Delivery time badge */}
        <div className="flex items-center gap-1 mb-1.5">
          <svg className="w-3 h-3 text-blinkit-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
          <span className="text-[10px] font-semibold text-gray-500">10 MINS</span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mb-1 leading-snug min-h-[2.5em]">
          {product.title}
        </h3>

        {/* Unit */}
        {product.unit && (
          <span className="text-[11px] text-gray-400 mb-2">{product.unit}</span>
        )}

        <div className="mt-auto flex items-end justify-between gap-1">
          {/* Price */}
          <div>
            <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
            {hasDiscount && (
              <div className="text-[11px] text-gray-400 line-through">₹{product.mrp}</div>
            )}
          </div>

          {/* Add / Quantity button */}
          {qty === 0 ? (
            <button
              onClick={() => addItem(product)}
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
              <span className="text-white w-6 text-center text-xs font-bold">{qty}</span>
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
