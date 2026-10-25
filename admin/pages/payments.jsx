import { useEffect, useState } from "react";

const API = "";

const METHOD_LABELS = {
  cod: { label: "Cash on Delivery", icon: "💵" },
  upi: { label: "UPI / QR", icon: "📱" },
  card: { label: "Debit/Credit Card", icon: "💳" },
  netbanking: { label: "Net Banking", icon: "🏦" },
  wallet: { label: "Digital Wallet", icon: "👛" },
};

export default function PaymentsAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function load() {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterMethod) params.set("method", filterMethod);

      const res = await fetch(`${API}/api/payments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPayments(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filterStatus, filterMethod]);

  async function handleMarkCompleted(paymentId) {
    if (!confirm("Mark this payment as completed/settled?")) return;
    try {
      const res = await fetch(`${API}/api/payments/${paymentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus: "completed" }),
      });
      if (res.ok) load();
    } catch {}
  }

  const totalSettled = payments
    .filter((p) => p.paymentStatus === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingSettlement = payments
    .filter((p) => p.paymentStatus === "pending")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    const txn = p.transactionId || "";
    const customer = p.customer?.name || "";
    const phone = p.customer?.phone || "";
    const q = searchQuery.toLowerCase();
    return (
      txn.toLowerCase().includes(q) ||
      customer.toLowerCase().includes(q) ||
      phone.includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white dark:bg-[#121212] rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white dark:bg-[#121212] rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-white dark:bg-[#121212] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <span className="font-outfit font-black text-lg">₹</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white font-outfit">
                Payments & Settlements
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Audit customer payment transactions, gateway escrows, and payout reconciliations
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs transition-all self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Ledger
        </button>
      </div>

      {/* 3 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total Transactions
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white mt-1 font-outfit">
              {payments.length}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Gateway events processed
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl shadow-md shadow-blue-500/20">
            📊
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Settled Revenue
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-outfit">
              ₹{totalSettled.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Cleared into nodal account
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
            ✅
          </div>
        </div>

        <div className="bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Pending Escrow Settlement
            </div>
            <div className="text-2xl font-black text-amber-500 mt-1 font-outfit flex items-center gap-2">
              {pendingSettlement > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />}
              ₹{pendingSettlement.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              T+1 banking batch
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-xl shadow-md shadow-amber-500/20">
            ⏳
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
            Status:
          </span>
          {[
            { id: "", label: "All" },
            { id: "completed", label: "Completed" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                filterStatus === st.id
                  ? "bg-[#0C831F] text-white shadow-sm"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Method & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
          >
            <option value="">All Payment Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="upi">UPI / QR Code</option>
            <option value="card">Cards</option>
            <option value="netbanking">Net Banking</option>
          </select>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search txn, customer, phone..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 dark:bg-[#161c27] text-[11px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-5">Transaction ID</th>
                <th className="py-3.5 px-5">Order Reference</th>
                <th className="py-3.5 px-5">Customer Profile</th>
                <th className="py-3.5 px-5">Payment Method</th>
                <th className="py-3.5 px-5">Settled Amount</th>
                <th className="py-3.5 px-5">Escrow Status</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400 dark:text-gray-500 font-medium">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const m = METHOD_LABELS[p.paymentMethod] || {
                    label: p.paymentMethod || "COD",
                    icon: "💵",
                  };
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/60 dark:hover:bg-[#1a1f2c]/50 transition-colors">
                      <td className="py-4 px-5">
                        <p className="font-mono font-bold text-gray-900 dark:text-white">
                          {p.transactionId || `PAY-${p._id.slice(-6).toUpperCase()}`}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          ID: {p._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="py-4 px-5 font-mono text-xs font-bold text-[#0C831F] dark:text-emerald-400">
                        {p.order?._id ? (
                          `#${p.order._id.slice(-6).toUpperCase()}`
                        ) : p.order ? (
                          `#${String(p.order).slice(-6).toUpperCase()}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {p.customer?.name || "Customer"}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                          {p.customer?.phone || ""}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-xs">
                          <span>{m.icon}</span> {m.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-black text-gray-900 dark:text-white font-outfit text-sm">
                        ₹{p.amount || 0}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                            p.paymentStatus === "completed"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                              : p.paymentStatus === "pending"
                                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.paymentStatus === "completed"
                                ? "bg-emerald-500"
                                : p.paymentStatus === "pending"
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-rose-500"
                            }`}
                          />
                          {p.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {p.paymentStatus === "pending" && (
                          <button
                            onClick={() => handleMarkCompleted(p._id)}
                            className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-[#0C831F] hover:text-white dark:hover:bg-[#0C831F] border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm"
                          >
                            Mark Settled
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
