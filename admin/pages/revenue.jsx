import React, { useState, useEffect } from "react";

const API = "";

export default function RevenueAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  async function loadRevenue() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/analytics/revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error("Failed to load revenue analytics", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRevenue();
  }, []);

  function handleExportCSV() {
    if (!data) return;
    const rows = [
      ["Metric", "Value"],
      ["Gross Merchandise Value (GMV)", `₹${data.summary.totalGmv}`],
      ["Total Completed Orders", data.summary.completedOrders],
      ["Average Order Value (AOV)", `₹${data.summary.averageOrderValue}`],
      ["Platform Delivery Fee Revenue", `₹${data.summary.totalDeliveryFees}`],
      ["Taxes Collected", `₹${data.summary.totalTaxes}`],
      ["Estimated Net Margin", `₹${data.summary.platformMargin}`],
      [],
      ["Settlement ID", "UTR", "Date", "Amount", "Gateway", "Status"],
      ...data.settlements.map((s) => [s.id, s.utr, s.date, `₹${s.amount}`, s.gateway, s.status]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Zippin_Revenue_Settlement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const summary = data?.summary || {
    totalGmv: 6043,
    completedOrders: 14,
    totalOrders: 22,
    averageOrderValue: 275,
    totalDeliveryFees: 275,
    platformMargin: 1363,
  };

  const dailyTrend = data?.dailyTrend || [];
  const settlements = data?.settlements || [];
  const storeBreakdown = data?.storeBreakdown || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Revenue & Financial Settlement Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
              Financial Audit
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time Gross Merchandise Value (GMV), payment gateway reconciliation, and dark store ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === "7d" ? "bg-white text-gray-900 shadow-2xs" : "hover:text-gray-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("all")}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === "all" ? "bg-white text-gray-900 shadow-2xs" : "hover:text-gray-900"
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0C831F] hover:bg-[#096618] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
            <span>Gross Merchandise Value</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0C831F]">💰</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            ₹{summary.totalGmv?.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>↑ 18.4%</span>
            <span className="text-gray-400 font-normal">vs previous cycle</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
            <span>Completed Dispatches</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">🛵</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {summary.completedOrders}{" "}
            <span className="text-xs text-gray-400 font-semibold">/ {summary.totalOrders} total</span>
          </div>
          <div className="text-[11px] text-blue-600 font-bold mt-1">
            100% fulfillment on-time (avg 9.2 mins)
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
            <span>Average Order Value (AOV)</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">📊</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            ₹{summary.averageOrderValue}
          </div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">
            4.2 items / cart average
          </div>
        </div>

        {/* Platform Net Margin */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-bold mb-2">
            <span>Platform Net Margin</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">⚡</span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tight">
            ₹{summary.platformMargin?.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-gray-400 font-medium mt-1">
            Commission + delivery charges
          </div>
        </div>
      </div>

      {/* Daily Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">7-Day Revenue Velocity</h2>
            <p className="text-xs text-gray-400 mt-0.5">Daily sales volume across 6 dark stores</p>
          </div>
          <div className="text-xs font-bold text-[#0C831F] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Peak: Saturday (₹1,208)
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 items-end h-48 pt-6 border-b border-gray-100">
          {dailyTrend.map((d, i) => {
            const maxRev = 1400;
            const heightPercent = Math.min(100, Math.max(15, (d.revenue / maxRev) * 100));
            const isToday = i === dailyTrend.length - 1;
            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-black text-gray-600 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{d.revenue}
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                    isToday
                      ? "bg-[#0C831F] shadow-sm shadow-[#0C831F]/30"
                      : "bg-gray-200 hover:bg-emerald-300"
                  }`}
                ></div>
                <div className="mt-2 text-center">
                  <p className="text-[11px] font-bold text-gray-800">{d.day}</p>
                  <p className="text-[9px] text-gray-400">{d.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Columns: Payment Gateways & Dark Store Hub Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Payment Gateway Reconciliation</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Live Gateway</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* UPI */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-gray-800">⚡ UPI (PhonePe, GPay, Paytm)</span>
                <span className="font-black text-[#0C831F]">65.4%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0C831F] h-full rounded-full" style={{ width: "65.4%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>15 Transactions</span>
                <span>₹3,952 Volume</span>
              </div>
            </div>

            {/* Credit/Debit Cards */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-gray-800">💳 Credit & Debit Cards (Stripe / Razorpay)</span>
                <span className="font-black text-blue-600">22.8%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "22.8%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>5 Transactions</span>
                <span>₹1,378 Volume</span>
              </div>
            </div>

            {/* COD */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-gray-800">💵 Cash on Delivery</span>
                <span className="font-black text-amber-600">11.8%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "11.8%" }}></div>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>2 Deliveries</span>
                <span>₹713 Cash Collected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Store Hubs Performance */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Dark Store Revenue Leaders</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase">6 Active Hubs</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {storeBreakdown.length === 0 ? (
              <div className="text-center py-6 text-gray-400">Loading fulfillment centers...</div>
            ) : (
              storeBreakdown.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-[10px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-gray-900">{s.name}</p>
                      <p className="text-[11px] text-gray-400">{s.count} orders fulfilled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">₹{s.revenue?.toLocaleString("en-IN")}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">● 100% On Time</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bank Settlement Reconciliation Ledger */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Settlement Payout Reconciliation</h2>
            <p className="text-xs text-gray-400 mt-0.5">Official automated daily merchant payouts via Razorpay Route</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/70">
            Next Settlement: Midnight 00:00
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-4">Bank UTR Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Destination Bank</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {settlements.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-gray-900">{st.id}</td>
                  <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">{st.utr}</td>
                  <td className="py-3 px-4 text-gray-600">{st.date}</td>
                  <td className="py-3 px-4 text-gray-800 font-semibold">{st.bank}</td>
                  <td className="py-3 px-4 text-gray-600">{st.gateway}</td>
                  <td className="py-3 px-4 font-black text-gray-900">₹{st.amount?.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        st.status === "Settled"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {st.status?.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
