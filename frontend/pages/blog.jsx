import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const POSTS = [
  {
    id: "post-1",
    title: "How Zippin Packs and Dispatches Orders in Under 120 Seconds",
    category: "Technology & Logistics",
    date: "October 22, 2026",
    readTime: "4 min read",
    snippet: "Inside our automated dark store layout: pick-by-light racks, smart algorithm zoning, and how our picking specialists shave critical seconds off fulfillment.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=75",
    author: "Zippin Tech Team",
  },
  {
    id: "post-2",
    title: "Farm to Doorstep: Redefining Cold Chain Logistics for Urban India",
    category: "Sustainability",
    date: "October 18, 2026",
    readTime: "5 min read",
    snippet: "How our direct farmer procurement program ensures spinach, coriander, and strawberries reach your breakfast table fresher than your local vegetable vendor.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=75",
    author: "Supply Chain Operations",
  },
  {
    id: "post-3",
    title: "5 Quick 10-Minute Dinner Recipes You Can Make with Zippin Groceries",
    category: "Lifestyle & Food",
    date: "October 14, 2026",
    readTime: "3 min read",
    snippet: "From creamy garlic butter mushroom pasta to spicy paneer bhurji wraps, get hot gourmet comfort food ready in minutes without step-by-step stress.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=75",
    author: "Zippin Foodies",
  },
  {
    id: "post-4",
    title: "Safety First: How Our Predictive Dispatch Eliminates Delivery Rushing",
    category: "Culture",
    date: "October 08, 2026",
    readTime: "4 min read",
    snippet: "Why dark store proximity means riders never need to break traffic rules. Delivering within 2 kilometers at safe cruising speeds of 20 km/h.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=75",
    author: "Rider Community Team",
  },
];

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Zippin Blog | Stories, Tech & Quick Commerce Insights</title>
        <meta
          name="description"
          content="Explore stories from Zippin. Read about instant logistics, recipes, engineering deep dives, and retail innovations."
        />
      </Head>

      <div className="bg-[#F4F6FB] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#0C831F] font-semibold">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Blog</span>
          </div>

          {/* Hero */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="bg-[#FFE141] text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Zippin Stories & Insights
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Life delivered at the speed of thought.
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Discover engineering milestones, behind-the-scenes warehouse operations, recipes, and quick commerce trends.
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {POSTS.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-lg font-black text-gray-900 group-hover:text-[#0C831F] transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {post.snippet}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">By {post.author}</span>
                    <span className="font-black text-[#0C831F] group-hover:translate-x-1 transition-transform">
                      Read story →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Box */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-xs text-center max-w-2xl mx-auto space-y-4">
            <span className="text-3xl">📬</span>
            <h3 className="text-xl font-black text-gray-900">Subscribe to Zippin Weekly</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Get secret discount drops, quick meal inspirations, and product launches delivered straight to your inbox.
            </p>
            {subscribed ? (
              <p className="text-xs font-bold text-[#0C831F]">You're on the list! Check your inbox soon.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"
                />
                <button
                  type="submit"
                  className="bg-[#0C831F] hover:bg-[#0a701b] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
