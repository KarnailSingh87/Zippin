import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const FAQS = [
  {
    q: "How does Zippin deliver orders in 8 to 10 minutes?",
    a: "We operate an automated central fulfillment store at Gandhi Chowk, Hamirpur. When you order, our pickers receive item locations on hand-held terminals, pack the bag in under 2 minutes, and hand it to a waiting delivery partner.",
  },
  {
    q: "What should I do if an item in my order is missing or damaged?",
    a: "We offer instant, no-questions-asked refunds! Head to 'My Orders' in your account, select the item with an issue, tap 'Report Problem', and your refund will be credited instantly to your original payment method or Zippin Wallet within seconds.",
  },
  {
    q: "Is there a minimum order value for free delivery?",
    a: "Orders above ₹199 enjoy 100% free delivery across all hubs. For orders below ₹199, a nominal delivery fee of ₹15–₹25 applies depending on proximity.",
  },
  {
    q: "What payment methods does Zippin accept?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay), Netbanking, and Cash on Delivery (COD).",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "Because our store team begins picking immediately upon order placement, cancellations are permitted within the first 60 seconds directly from the live tracking screen.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [ticketSent, setTicketSent] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleTicket = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setMessage("");
      setEmail("");
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Customer Support & Help Center | Zippin 24/7 Assistance</title>
        <meta
          name="description"
          content="Get instant 24/7 help with your Zippin orders, refunds, cancellations, and payment questions."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Customer Support</span>
          </div>

          {/* Hero */}
          <div className="text-center space-y-3">
            <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              24/7 Customer Care
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              We're here to help you.
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto">
              Have questions about your order, delivery timeline, or an instant refund? Find immediate answers below or reach our team directly.
            </p>
          </div>

          {/* Quick Contact Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center space-y-2">
              <span className="text-3xl">💬</span>
              <h3 className="font-bold text-sm text-gray-900">In-App Live Chat</h3>
              <p className="text-xs text-gray-500">Instant answers in under 60 seconds</p>
              <button
                onClick={() => alert("Connecting to Zippin Support Specialist...")}
                className="text-xs font-bold text-[#0C831F] hover:underline"
              >
                Start Live Chat →
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center space-y-2">
              <span className="text-3xl">📱</span>
              <h3 className="font-bold text-sm text-gray-900">WhatsApp Support</h3>
              <p className="text-xs text-gray-500">+91 98765 ZIPPIN</p>
              <a
                href="https://wa.me/919999900001"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#0C831F] hover:underline inline-block"
              >
                Chat on WhatsApp →
              </a>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs text-center space-y-2">
              <span className="text-3xl">✉️</span>
              <h3 className="font-bold text-sm text-gray-900">Email Support</h3>
              <p className="text-xs text-gray-500">support@zippin.com</p>
              <a
                href="mailto:support@zippin.com"
                className="text-xs font-bold text-[#0C831F] hover:underline inline-block"
              >
                Send Email →
              </a>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-gray-900 mb-2">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg font-light text-gray-400">
                      {openIndex === i ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === i && (
                    <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-black text-gray-900">Send Us a Direct Message</h2>
            <p className="text-xs text-gray-500">
              Need assistance with an ongoing order or feedback? Drop a message and we'll reply right away.
            </p>

            {ticketSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-[#0C831F] font-bold text-xs text-center">
                ✓ Message received! Our support team will get in touch via email.
              </div>
            ) : (
              <form onSubmit={handleTicket} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Registered Email Address"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or order number (e.g. #ORD-2026-101)..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition-all active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
