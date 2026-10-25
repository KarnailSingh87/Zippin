import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const { user, token, logout, updateUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [walletBalance, setWalletBalance] = useState(500);

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    pincode: "",
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
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

  async function handleSaveProfile() {
    setSaving(true);
    await updateUser({ name, email, phone, avatar });
    setEditing(false);
    setSaving(false);
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    // Simulating Cloudinary / S3 upload
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      setAvatar(dataUrl);
      await updateUser({ avatar: dataUrl });
      setUploadingAvatar(false);
    };
    reader.readAsDataURL(file);
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

      {/* Profile card with Avatar & Photo Upload (TC-3.8.01) */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-full bg-blinkit-green text-white text-xl font-bold flex items-center justify-center overflow-hidden border-2 border-emerald-500 shadow-xs">
              {avatar ? (
                <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span>📷</span>
              <span>{uploadingAvatar ? "..." : "upload"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-green text-xs px-3 py-1.5"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(user.name);
                      setEmail(user.email);
                      setPhone(user.phone);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">{user.name}</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs font-bold text-blinkit-green hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                <p className="text-xs text-gray-500">{user.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Wallet & Cashback Balance Card (TC-3.8.03) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👛</span>
            <div>
              <h3 className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Zippin Wallet</h3>
              <div className="text-2xl font-black">₹{walletBalance}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setWalletBalance((prev) => prev + 200);
              alert("₹200 added to your wallet balance!");
            }}
            className="bg-white text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xs hover:bg-emerald-50 transition-all active:scale-95"
          >
            + Top Up Wallet
          </button>
        </div>
        <p className="text-[11px] text-emerald-100">
          Instant 1-tap checkout enabled for rapid 8-minute delivery.
        </p>
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
                    {addr.street}, {addr.city} {addr.pincode}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveAddress(idx)}
                  className="text-gray-400 hover:text-red-500 text-xs transition-colors p-1"
                  title="Remove address"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {showAddAddress && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            <h3 className="text-xs font-bold text-gray-700">Add New Address</h3>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((label) => (
                <button
                  key={label}
                  onClick={() => setNewAddress({ ...newAddress, label })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    newAddress.label === label
                      ? "bg-blinkit-green text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Street / Flat / House No."
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blinkit-green"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blinkit-green"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-blinkit-green"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddAddress}
                disabled={saving}
                className="btn-green text-xs px-3 py-2"
              >
                Save Address
              </button>
              <button
                onClick={() => setShowAddAddress(false)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full bg-white rounded-xl shadow-card p-3 text-center text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}
