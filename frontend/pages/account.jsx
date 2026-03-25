import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, token, logout, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    pincode: "",
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/account");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-blinkit-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSaveName() {
    setSaving(true);
    await updateUser({ name });
    setEditing(false);
    setSaving(false);
  }

  async function handleAddAddress() {
    if (!newAddress.street) return;
    const addresses = [...(user.addresses || []), newAddress];
    setSaving(true);
    await updateUser({ addresses });
    setShowAddAddress(false);
    setNewAddress({ label: "Home", street: "", city: "", pincode: "" });
    setSaving(false);
  }

  async function handleRemoveAddress(idx) {
    const addresses = (user.addresses || []).filter((_, i) => i !== idx);
    await updateUser({ addresses });
  }

  return (
    <div className="px-4 py-4 pb-20 md:pb-6 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Account</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-blinkit-green flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                />
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="btn-green text-xs px-3 py-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setName(user.name);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-blinkit-green hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Link
          href="/orders"
          className="bg-white rounded-xl shadow-card p-4 text-center hover:shadow-card-hover transition-all"
        >
          <span className="text-2xl">📦</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">My Orders</p>
          <p className="text-xs text-gray-400">Track & manage orders</p>
        </Link>
        <button
          onClick={() => setShowAddAddress(true)}
          className="bg-white rounded-xl shadow-card p-4 text-center hover:shadow-card-hover transition-all"
        >
          <span className="text-2xl">📍</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            Add Address
          </p>
          <p className="text-xs text-gray-400">Save delivery location</p>
        </button>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <h2 className="text-sm font-bold text-gray-800 mb-3">
          Saved Addresses
        </h2>
        {(user.addresses || []).length === 0 ? (
          <p className="text-sm text-gray-400">No saved addresses</p>
        ) : (
          <div className="space-y-3">
            {(user.addresses || []).map((addr, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <span className="text-lg mt-0.5">
                  {addr.label === "Home"
                    ? "🏠"
                    : addr.label === "Work"
                      ? "💼"
                      : "📌"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {addr.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {addr.street}, {addr.city} - {addr.pincode}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveAddress(idx)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add address modal */}
      {showAddAddress && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-custom"
          onClick={() => setShowAddAddress(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 w-full max-w-md animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Add New Address
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
                      onClick={() => setNewAddress({ ...newAddress, label: l })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${newAddress.label === l ? "bg-blinkit-green text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {l}
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
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  placeholder="123, Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
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
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddAddress(false)}
                className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                disabled={saving}
                className="flex-1 btn-green py-3 text-sm"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="w-full bg-white rounded-xl shadow-card p-4 text-center text-red-500 font-semibold hover:bg-red-50 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
