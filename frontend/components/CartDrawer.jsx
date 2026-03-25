import React from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    removeItem,
    addItem,
    updateQty,
    clearCart,
    isOpen,
    setIsOpen,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const deliveryFee = totalPrice >= 499 ? 0 : 30;
  const grandTotal = totalPrice + deliveryFee;

  function handleCheckout() {
    setIsOpen(false);
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-custom"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-drawer animate-slide-in flex flex-col">
        {/* Header */}
        <div className="bg-blinkit-green px-4 py-3 flex items-center justify-between shrink-0">
          <div className="text-white">
            <h2 className="text-lg font-bold">My Cart</h2>
            <p className="text-xs text-white/70">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Delivery banner */}
        <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 border-b border-blue-100 shrink-0">
          <span className="text-lg">⚡</span>
          <div>
            <p className="text-xs font-semibold text-blue-800">
              Delivery in 10 minutes
            </p>
            <p className="text-[10px] text-blue-600">
              Shipment of {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              <p className="text-sm font-medium">Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-green text-xs"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <img
                  src={
                    item.image ||
                    `https://placehold.co/80x80/f0f0f0/666?text=${encodeURIComponent(item.name.split(" ")[0])}`
                  }
                  alt={item.name}
                  className="w-14 h-14 object-contain rounded-lg bg-gray-50 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400">{item.unit}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{item.price * item.qty}
                    </span>
                    {item.mrp > item.price && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{item.mrp * item.qty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center bg-blinkit-green rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-white w-7 h-7 flex items-center justify-center text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="text-white w-6 text-center text-xs font-bold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="text-white w-7 h-7 flex items-center justify-center text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bill details */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 shrink-0">
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                Bill Details
              </h3>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items total</span>
                  <div className="flex items-center gap-1">
                    {totalSavings > 0 && (
                      <span className="line-through text-gray-400">
                        ₹{totalPrice + totalSavings}
                      </span>
                    )}
                    <span className="font-medium text-gray-800">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Delivery charge</span>
                  <span
                    className={
                      deliveryFee === 0
                        ? "text-blinkit-green font-medium"
                        : "text-gray-800 font-medium"
                    }
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-blinkit-green font-medium">
                    <span>Total savings</span>
                    <span>₹{totalSavings}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Checkout */}
            <div className="px-4 pb-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-blinkit-green text-white py-3 rounded-xl font-bold text-sm hover:bg-blinkit-green-dark transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <span className="bg-white/20 rounded-md px-2 py-0.5 text-xs">
                  ₹{grandTotal}
                </span>
              </button>
              {totalPrice < 499 && (
                <p className="text-center text-[10px] text-gray-400 mt-2">
                  Add ₹{499 - totalPrice} more for free delivery
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
