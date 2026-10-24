import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const API = "";

export default function CheckoutPage() {
  const { items, totalPrice, totalSavings, clearCart } = useCart();
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    label: "Home",
    street: "",
    city: "Gurugram",
    pincode: "122001",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  // Set address from user profile once loaded
  useEffect(() => {
    if (user?.addresses?.[0]) {
      setAddress((prev) => ({
        ...prev,
        street: user.addresses[0].street || prev.street,
        city: user.addresses[0].city || prev.city,
        pincode: user.addresses[0].pincode || prev.pincode,
      }));
    }
  }, [user]);

  // Redirect to login if not authenticated (after auth loading finishes)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  const deliveryFee = totalPrice >= 199 ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;

  async function handlePlaceOrder() {
    if (!token) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          deliveryAddress: address,
          payment: {
            method: paymentMethod,
            status: paymentMethod === "cod" ? "pending" : "completed",
          },
        }),
      });
      const order = await res.json();
      if (res.ok) {
        setOrderPlaced(order);
        clearCart();
      }
    } catch {}
    setLoading(false);
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-blinkit-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <span className="text-5xl mb-3">🛒</span>
        <p className="font-medium">Your cart is empty</p>
        <button
          onClick={() => router.push("/")}
          className="btn-green mt-4 text-sm"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  // Order placed success
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-card p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 delivery-pulse">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed!
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Your groceries will be delivered in ~10 minutes
          </p>
          <div className="bg-blinkit-green-light rounded-xl p-4 mb-4">
            <p className="text-xs text-blinkit-green font-semibold">
              Estimated Delivery
            </p>
            <p className="text-lg font-bold text-blinkit-green">
              10 minutes ⚡
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/orders/${orderPlaced._id}`)}
              className="flex-1 btn-green text-sm py-3"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 py-3 hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-20 md:pb-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s
                  ? "bg-blinkit-green text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {s}
            </div>
            <span
              className={`text-xs font-medium ${step >= s ? "text-gray-800" : "text-gray-400"}`}
            >
              {s === 1 ? "Address" : s === 2 ? "Payment" : "Confirm"}
            </span>
            {s < 3 && (
              <div
                className={`flex-1 h-0.5 ${step > s ? "bg-blinkit-green" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-5">
        {/* Step 1: Address */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📍 Delivery Address
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Label
                </label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setAddress({ ...address, label: l })}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        address.label === l
                          ? "bg-blinkit-green text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📌"} {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  placeholder="e.g. 123, MG Road, Sector 18"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full btn-green mt-5 py-3 text-sm"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              💳 Payment Method
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "cod",
                  label: "Cash on Delivery",
                  icon: "💵",
                  desc: "Pay when your order arrives",
                },
                {
                  id: "upi",
                  label: "UPI",
                  icon: "📱",
                  desc: "Pay via Google Pay, PhonePe, etc.",
                },
                {
                  id: "card",
                  label: "Credit/Debit Card",
                  icon: "💳",
                  desc: "Visa, Mastercard, RuPay",
                },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === pm.id
                      ? "border-blinkit-green bg-blinkit-green-light"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{pm.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {pm.label}
                    </p>
                    <p className="text-xs text-gray-500">{pm.desc}</p>
                  </div>
                  {paymentMethod === pm.id && (
                    <svg
                      className="w-5 h-5 text-blinkit-green ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 btn-green py-3 text-sm"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📋 Order Summary
            </h2>

            {/* Items */}
            <div className="divide-y divide-gray-100 mb-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 py-2"
                >
                  <img
                    src={item.image || `https://placehold.co/40x40`}
                    alt=""
                    className="w-10 h-10 rounded-lg object-contain bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.unit} × {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-bold">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Address & Payment */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium">
                  {address.label}: {address.street}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium capitalize">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Bill */}
            <div className="space-y-1 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Items total</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span
                  className={
                    deliveryFee === 0 ? "text-blinkit-green font-medium" : ""
                  }
                >
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-blinkit-green font-medium">
                  <span>Savings</span>
                  <span>-₹{totalSavings}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-1 btn-green py-3 text-sm disabled:opacity-50"
              >
                {loading ? "Placing Order..." : `Place Order • ₹${grandTotal}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
