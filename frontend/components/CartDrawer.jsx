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
    isOpen,
    setIsOpen,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 199;
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD || totalPrice === 0 ? 0 : 25;
  const handlingCharge = totalPrice > 0 ? 4 : 0;
  const grandTotal = totalPrice + deliveryFee + handlingCharge;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const freeDeliveryProgress = Math.min(100, Math.round((totalPrice / FREE_DELIVERY_THRESHOLD) * 100));

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
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F4F6FB] z-50 shadow-2xl animate-slide-in flex flex-col">
        {/* Top Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-base font-black text-gray-900">My Cart</h2>
            <p className="text-xs text-gray-500 font-medium">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-bold text-lg"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {totalItems === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl border border-gray-100">
            <img
              src="/images/empty_cart.webp"
              alt="Empty cart"
              className="w-48 h-48 object-contain mb-4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              You haven't added any items yet!
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mb-6">
              Browse from fresh fruits, veggies, dairy, snacks, and daily essentials with delivery in 8 minutes.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-[#0C831F] hover:bg-[#0a701b] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          /* Active Cart */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Delivery ETA Pill */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0C831F] flex items-center justify-center text-xl shrink-0">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-gray-900">
                    Delivery in 8 minutes
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Order will be prepared at your nearest dark store
                  </div>
                </div>
              </div>

              {/* Free Delivery Meter */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
                {amountNeededForFreeDelivery > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                      <span className="text-gray-800">
                        Add ₹{amountNeededForFreeDelivery} more for <span className="text-[#0C831F]">FREE Delivery</span>
                      </span>
                      <span className="text-gray-400 font-medium">
                        {freeDeliveryProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0C831F] h-full rounded-full transition-all duration-300"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0C831F]">
                    <span>🎉</span>
                    <span>Yay! You've unlocked FREE Delivery on this order.</span>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.product._id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={
                        item.product.images?.[0]?.url ||
                        `https://placehold.co/60x60/f0f0f0/666?text=Blinkit`
                      }
                      alt={item.product.title}
                      className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        {item.product.unit || "1 unit"}
                      </p>
                      <div className="text-xs font-black text-gray-900 mt-1">
                        ₹{item.product.price * item.quantity}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 font-normal ml-1">
                            (₹{item.product.price} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Pill */}
                    <div className="flex items-center bg-[#0C831F] text-white rounded-lg overflow-hidden shrink-0 shadow-2xs">
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#0a6b19] font-black text-xs transition-colors"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-xs font-black select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item.product)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-[#0a6b19] font-black text-xs transition-colors"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2">
                  Bill Details
                </h4>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Items Total</span>
                  <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-[#0C831F] font-bold">FREE</span>
                    ) : (
                      <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Handling Charge</span>
                  <span className="font-semibold text-gray-900">₹{handlingCharge}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-xs text-[#0C831F] font-bold bg-emerald-50/70 p-2 rounded-xl">
                    <span>Your Total Savings</span>
                    <span>₹{totalSavings}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-gray-100/70 p-3 rounded-xl text-[11px] text-gray-500 leading-tight">
                <span className="font-bold text-gray-700">Cancellation Policy: </span>
                Orders cannot be cancelled once packed for delivery. In case of unexpected delay, refund will be provided.
              </div>
            </div>

            {/* Bottom Checkout Action */}
            <div className="bg-white p-4 border-t border-gray-200 shrink-0">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#0C831F] hover:bg-[#0a701b] text-white py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-between shadow-lg active:scale-98 transition-all"
              >
                <div className="text-left leading-tight">
                  <div className="text-xs opacity-80 uppercase tracking-wide">
                    {totalItems} item{totalItems > 1 ? "s" : ""}
                  </div>
                  <div className="text-base font-black">₹{grandTotal}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span>Proceed to Pay</span>
                  <span className="text-lg">→</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
