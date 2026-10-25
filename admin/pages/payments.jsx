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

  if (loading) {
    return <div className="h-64 bg-white rounded-xl animate-pulse" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>💳</span> Payments & Settlements
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit customer payments, gateways, and order settlements (DBMS ER Model: payment)
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {payments.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
            📊
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Settled Revenue</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              ₹{totalSettled.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl">
            ✅
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Settlement</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              ₹{pendingSettlement.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            ⏳
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Status:
          </span>
          {["", "completed", "pending", "failed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                filterStatus === st
                  ? "bg-admin-green text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st || "All"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Method:
          </span>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="text-xs border rounded-lg px-2.5 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-admin-green"
          >
            <option value="">All Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="upi">UPI / QR Code</option>
            <option value="card">Cards</option>
            <option value="netbanking">Net Banking</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
              <tr>
                <th className="py-3 px-4">Transaction / Payment ID</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-400">
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const m = METHOD_LABELS[p.paymentMethod] || {
                    label: p.paymentMethod || "COD",
                    icon: "💵",
                  };
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-gray-700">
                        <p className="font-semibold text-gray-900">
                          {p.transactionId || `PAY-${p._id.slice(-6).toUpperCase()}`}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ID: {p._id.slice(-6).toUpperCase()}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600">
                        {p.order?._id ? (
                          `#${p.order._id.slice(-6).toUpperCase()}`
                        ) : p.order ? (
                          `#${String(p.order).slice(-6).toUpperCase()}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 text-xs">
                          {p.customer?.name || "Customer"}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                          {p.customer?.phone || ""}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span>{m.icon}</span> {m.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{p.amount || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            p.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : p.paymentStatus === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.paymentStatus || "pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {p.paymentStatus === "pending" && (
                          <button
                            onClick={() => handleMarkCompleted(p._id)}
                            className="bg-green-50 hover:bg-green-600 hover:text-white border border-green-200 text-green-700 text-xs px-2.5 py-1 rounded font-medium transition-colors"
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
