import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, useAnimate, useMotionValue, animate } from "motion/react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductModal from "./ProductModal";
import { createArcMixer, BasketIcon } from "./ui/motion-add-to-basket";

export default function ProductCard({ product }) {
  const { addItem, removeItem, getQty } = useCart();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const qty = getQty(product._id);
  const isOutOfStock = product.stock === 0 || product.isAvailable === false;
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.images?.[0]?.url;

  // Motion Add to Basket Animation State & Refs
  const [scope, animateElement] = useAnimate();
  const imgRef = useRef(null);
  const basketRef = useRef(null);
  const pingRef = useRef(null);
  const [isFlying, setIsFlying] = useState(false);

  const flyX = useMotionValue(0);
  const flyY = useMotionValue(0);
  const flyRotate = useMotionValue(0);
  const flyScale = useMotionValue(1);
  const flyOpacity = useMotionValue(0);

  const handleMotionAdd = async (e) => {
    if (e) e.stopPropagation();
    if (isFlying || isOutOfStock) return;

    const img = imgRef.current;
    const basket = basketRef.current;
    const ping = pingRef.current;

    if (!img || !basket) {
      addItem(product);
      if (showToast) showToast(`Added to cart: ${product.title}`);
      return;
    }

    setIsFlying(true);
    flyOpacity.set(1);
    flyScale.set(1);

    const from = img.getBoundingClientRect();
    const to = basket.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    const mix = createArcMixer({
      strength: 0.45,
      peak: 0.15,
      rotate: 0.75,
      direction: "cw",
    });
    const path = mix({ x: 0, y: 0 }, { x: dx, y: dy });

    await animate(0, 1, {
      duration: 0.42,
      ease: [0.74, 0.18, 0.93, 0.69],
      onUpdate: (progress) => {
        const point = path(progress);
        flyX.set(point.x);
        flyY.set(point.y);
        if (point.rotate !== undefined) flyRotate.set(point.rotate);
        flyScale.set(1 - 0.65 * progress);
        flyOpacity.set(progress < 0.9 ? 1 : 1 - (progress - 0.9) / 0.1);
      },
    });

    addItem(product);
    if (showToast) showToast(`Added to cart: ${product.title}`);

    // Squash & spring bounce on basket receiving item
    if (basket) {
      animateElement(
        basket,
        { scale: [1, 1.35, 0.9, 1.1, 1] },
        { duration: 0.4, ease: "easeOut" }
      );
    }
    // Radiant ping wave
    if (ping) {
      animateElement(
        ping,
        { scale: [1, 2.3], opacity: [0.85, 0] },
        { duration: 0.45, ease: "easeOut" }
      );
    }

    flyX.set(0);
    flyY.set(0);
    flyRotate.set(0);
    flyScale.set(1);
    flyOpacity.set(0);
    setIsFlying(false);
  };

  const handleIncrement = (e) => {
    if (e) e.stopPropagation();
    addItem(product);
    if (basketRef.current) {
      animateElement(
        basketRef.current,
        { scale: [1, 1.25, 0.95, 1] },
        { duration: 0.3, ease: "easeOut" }
      );
    }
    if (pingRef.current) {
      animateElement(
        pingRef.current,
        { scale: [1, 1.8], opacity: [0.7, 0] },
        { duration: 0.35, ease: "easeOut" }
      );
    }
  };

  const handleDecrement = (e) => {
    if (e) e.stopPropagation();
    removeItem(product._id);
  };

  return (
    <>
      <div
        ref={scope}
        onClick={() => setShowModal(true)}
        className="bg-white rounded-2xl border border-gray-200/80 p-3 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-200 flex flex-col justify-between group relative cursor-pointer overflow-visible select-none"
      >
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
              ref={imgRef}
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 select-none"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div ref={imgRef} className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl text-3xl">
              🛍️
            </div>
          )}

          {/* Flying Motion Item (Curved Arc Parabolic Trajectory) */}
          <motion.div
            className="absolute pointer-events-none z-50 w-16 h-16 rounded-xl bg-white/95 border border-emerald-300 shadow-xl flex items-center justify-center p-1.5"
            style={{
              x: flyX,
              y: flyY,
              rotate: flyRotate,
              scale: flyScale,
              opacity: flyOpacity,
            }}
          >
            {imageUrl && !imgError ? (
              <img src={imageUrl} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-2xl">🛍️</span>
            )}
          </motion.div>
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

          {/* Pricing & Motion Add Button */}
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

            {/* ADD / Quantity Counter Button with Motion Basket */}
            <div onClick={(e) => e.stopPropagation()} className="relative">
              {product.stock === 0 || isOutOfStock ? (
                <button
                  disabled
                  className="border border-gray-300 text-gray-400 bg-gray-100 font-bold text-[11px] uppercase px-2.5 py-1.5 rounded-lg cursor-not-allowed"
                >
                  out of stock
                </button>
              ) : qty === 0 ? (
                <div className="relative inline-flex items-center">
                  {/* Ping Wave Effect */}
                  <div
                    ref={pingRef}
                    className="absolute inset-0 rounded-lg bg-emerald-500 pointer-events-none opacity-0"
                  />
                  <motion.button
                    ref={basketRef}
                    onClick={handleMotionAdd}
                    disabled={isFlying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    className="border border-[#0C831F] text-[#0C831F] bg-[#F7FFF9] hover:bg-[#0C831F] hover:text-white font-black text-xs uppercase px-3 py-1.5 rounded-lg transition-colors duration-150 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    title="Add to basket with parabolic flight motion"
                  >
                    <BasketIcon size={14} className="shrink-0" />
                    <span>ADD</span>
                  </motion.button>
                </div>
              ) : (
                <div className="relative inline-flex items-center">
                  {/* Ping Wave Effect */}
                  <div
                    ref={pingRef}
                    className="absolute inset-0 rounded-lg bg-emerald-400 pointer-events-none opacity-0"
                  />
                  <div
                    ref={basketRef}
                    className="flex items-center bg-[#0C831F] text-white rounded-lg overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={handleDecrement}
                      className="w-7 h-7 flex items-center justify-center hover:bg-[#0a6b19] font-black text-sm transition-colors active:scale-90"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-xs font-black select-none">
                      {qty}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-7 h-7 flex items-center justify-center hover:bg-[#0a6b19] font-black text-sm transition-colors active:scale-90"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal (defaults to Motion Add View) */}
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
