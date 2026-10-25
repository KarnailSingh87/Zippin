import { useState, useEffect } from "react";
import Head from "next/head";

const API = "";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [walletModalUser, setWalletModalUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const res = await fetch(`${API}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error loading users:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleBlock(id) {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/auth/users/${id}/block`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isBlocked: data.isBlocked } : u))
        );
      }
    } catch (err) {
      alert("Failed to toggle block status: " + err.message);
    }
  }

  async function handleAdjustWallet(e) {
    e.preventDefault();
    if (!walletModalUser || !walletAmount) return;
    setAdjusting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/auth/users/${walletModalUser._id}/wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(walletAmount) }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u._id === walletModalUser._id ? { ...u, walletBalance: data.walletBalance } : u
          )
        );
        setWalletModalUser(null);
        setWalletAmount("");
      } else {
        alert("Wallet adjustment failed");
      }
    } catch (err) {
      alert("Error adjusting wallet: " + err.message);
    }
    setAdjusting(false);
  }

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u._id && u._id.includes(q));
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "blocked"
        ? u.isBlocked
        : !u.isBlocked;
    const matchesRole =
      filterRole === "all"
        ? true
        : u.roles && u.roles.includes(filterRole);
    return matchesSearch && matchesStatus && matchesRole;
  });

  function exportCSV() {
    const headers = ["User_ID", "Name", "Email", "Phone", "Wallet_Balance", "Status", "Joined"];
    const rows = filteredUsers.map((u) => [
      u._id,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      u.walletBalance || 0,
      u.isBlocked ? "Blocked" : "Active",
      new Date(u.createdAt).toLocaleDateString("en-IN"),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `zippin_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  return (
    <div className="space-y-6">
      <Head>
        <title>Customer Management (CRM) | Zippin Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Customer CRM Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#0C831F] dark:text-emerald-400 text-xs font-bold">
              {users.length} Registered
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage customer accounts, inspect purchase history, adjust wallet balances & manage suspensions
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Directory
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <input
            type="text"
            placeholder="Search customers by name, email, phone number or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
          />
          <svg className="w-4 h-4 absolute left-3.5 top-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] text-xs text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked / Suspended</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">Loading customer accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">No customers found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 dark:bg-gray-800/50 text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">Customer Profile</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Wallet Balance</th>
                  <th className="px-5 py-3.5">Account Status</th>
                  <th className="px-5 py-3.5">Joined Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {user.name || "Customer"}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                            ID: {user._id.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-gray-900 dark:text-gray-100">{user.email || "No email"}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 dark:text-white">
                          ₹{user.walletBalance || 0}
                        </span>
                        <button
                          onClick={() => setWalletModalUser(user)}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          Adjust
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-[11px]">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleBlock(user._id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          user.isBlocked
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        {user.isBlocked ? "Unblock Account" : "Block User"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wallet Adjustment Modal */}
      {walletModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161c27] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-black text-gray-900 dark:text-white">Adjust Wallet Balance</h3>
            <p className="text-xs text-gray-500 mt-1">
              Add or deduct credits for {walletModalUser.name || walletModalUser.email}
            </p>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-xs flex justify-between">
              <span className="text-gray-500">Current Balance:</span>
              <span className="font-bold text-gray-900 dark:text-white">₹{walletModalUser.walletBalance || 0}</span>
            </div>
            <form onSubmit={handleAdjustWallet} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Credit / Debit Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 100 or -50"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                  required
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-1">Use positive numbers to add credit, negative to deduct.</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWalletModalUser(null)}
                  className="w-1/2 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="w-1/2 py-2 rounded-xl text-xs font-bold bg-[#0C831F] text-white hover:bg-[#0a731b]"
                >
                  {adjusting ? "Updating..." : "Save Balance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
