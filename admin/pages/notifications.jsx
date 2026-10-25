import { useState } from "react";
import Head from "next/head";

const INITIAL_CAMPAIGNS = [
  {
    id: "camp-001",
    title: "⚡ Flash 10-Minute Mango Festival!",
    body: "Fresh Alphonso and Kesar mangoes just arrived at your nearest dark store. Get 20% off with MANGO20.",
    channel: "Push Notification",
    targetAudience: "All NCR Customers",
    recipients: 14250,
    delivered: "99.4%",
    clicks: "18.2%",
    sentAt: "2026-10-25 14:30",
    status: "Sent",
  },
  {
    id: "camp-002",
    title: "🌧️ Rain Alert: Free Delivery on Hot Snacks",
    body: "Rainy evening cravings? Enjoy hot samosas, chai & snacks delivered in 9 mins with ZERO delivery fee.",
    channel: "WhatsApp & Push",
    targetAudience: "Hamirpur Hub Customers",
    recipients: 8400,
    delivered: "98.9%",
    clicks: "24.5%",
    sentAt: "2026-10-24 18:00",
    status: "Sent",
  },
  {
    id: "camp-003",
    title: "We miss you! Flat ₹100 off your next order",
    body: "Use code WELCOMEBACK on orders above ₹299. Valid for 48 hours.",
    channel: "SMS",
    targetAudience: "Dormant Users (>14 days)",
    recipients: 3120,
    delivered: "97.1%",
    clicks: "11.4%",
    sentAt: "2026-10-22 11:00",
    status: "Sent",
  },
];

export default function NotificationsBroadcast() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("Push Notification");
  const [targetAudience, setTargetAudience] = useState("All NCR Customers");
  const [deeplink, setDeeplink] = useState("");
  const [sending, setSending] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  function handleSendBroadcast(e) {
    e.preventDefault();
    if (!title || !body) return;
    setSending(true);

    setTimeout(() => {
      const newCamp = {
        id: "camp-" + (campaigns.length + 1).toString().padStart(3, "0"),
        title,
        body,
        channel,
        targetAudience,
        recipients: targetAudience.includes("All") ? 25400 : 8500,
        delivered: "99.2%",
        clicks: "0.0%",
        sentAt: new Date().toISOString().replace("T", " ").slice(0, 16),
        status: "Sent",
      };
      setCampaigns([newCamp, ...campaigns]);
      setTitle("");
      setBody("");
      setDeeplink("");
      setSending(false);
      setSuccessToast(`Broadcast dispatched to ${newCamp.recipients.toLocaleString()} customers!`);
      setTimeout(() => setSuccessToast(""), 4000);
    }, 600);
  }

  return (
    <div className="space-y-6">
      <Head>
        <title>Broadcast Notifications Center | Zippin Admin</title>
      </Head>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#121212] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Customer Broadcast Notification Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold">
              Omnichannel
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Send geo-targeted marketing announcements, rain alerts & flash sale notifications via Push, SMS, and WhatsApp
          </p>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <span>✓</span> {successToast}
        </div>
      )}

      {/* Broadcast Composer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Compose New Broadcast
          </h2>
          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Dispatch Channel
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  <option value="Push Notification">Mobile Push Notification (Firebase Cloud Messaging)</option>
                  <option value="WhatsApp & Push">WhatsApp Business + Mobile Push</option>
                  <option value="SMS">Transactional SMS (DLT Approved)</option>
                  <option value="Email">Email Newsletter</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                >
                  <option value="All Hamirpur Customers">All Hamirpur District Customers (Gandhi Chowk & Localities)</option>
                  <option value="Hamirpur Hub Customers">Hamirpur Central Hub (Gandhi Chowk, Anu & Salasi)</option>
                  <option value="NIT Hamirpur Campus">NIT Hamirpur Student & Faculty Community</option>
                  <option value="Dormant Users (>14 days)">Dormant Accounts (Inactive for &gt; 14 days)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚡ Flash Deal: 50% Off Fresh Strawberries!"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Write compelling announcement copy..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Deep-Link URL or Category Tag (Optional)
              </label>
              <input
                type="text"
                value={deeplink}
                onChange={(e) => setDeeplink(e.target.value)}
                placeholder="e.g. /category/fruits-vegetables or coupon:BERRY50"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-6 py-2.5 bg-[#0C831F] hover:bg-[#0a731b] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 active:scale-95 transition-all cursor-pointer"
              >
                {sending ? "Transmitting..." : "Send Mass Broadcast Now"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Mobile Device Preview */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
          <h2 className="text-xs font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-4 self-start">
            Customer Lock Screen Preview
          </h2>
          <div className="w-64 bg-black rounded-3xl p-3 border-4 border-gray-700 shadow-2xl space-y-3">
            <div className="w-16 h-3 bg-gray-800 rounded-full mx-auto" />
            <div className="bg-gray-900/90 text-white rounded-2xl p-3 border border-gray-800 space-y-1.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-yellow-400 rounded-sm flex items-center justify-center text-black font-black text-[8px]">⚡</div>
                  <span className="font-bold text-white">ZIPPIN</span>
                </div>
                <span>now</span>
              </div>
              <div className="text-[11px] font-bold text-white leading-tight">
                {title || "Lightning 9-Min Delivery"}
              </div>
              <div className="text-[10px] text-gray-300 leading-snug">
                {body || "Fresh daily staples, dairy, beverages & snacks delivered at your doorstep in minutes."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Ledger */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Past Broadcast Campaigns
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">{campaigns.length} total campaigns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 dark:bg-gray-800/50 text-[11px] font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3.5">Campaign & Message</th>
                <th className="px-5 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Audience Segment</th>
                <th className="px-5 py-3.5">Delivered</th>
                <th className="px-5 py-3.5">CTR</th>
                <th className="px-5 py-3.5">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-bold text-gray-900 dark:text-white truncate">{c.title}</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{c.body}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-700 dark:text-gray-300">{c.channel}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">{c.targetAudience}</td>
                  <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">{c.delivered}</td>
                  <td className="px-5 py-4 font-bold text-blue-600 dark:text-blue-400">{c.clicks}</td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-[11px]">{c.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
