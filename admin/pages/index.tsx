import { useEffect, useState } from 'react';

const API = '';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    async function load() {
      try {
        const [prodRes, catRes, ordRes] = await Promise.all([
          fetch(`${API}/api/products?limit=999`),
          fetch(`${API}/api/categories`),
          fetch(`${API}/api/orders/all`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const products = prodRes.ok ? await prodRes.json() : [];
        const categories = catRes.ok ? await catRes.json() : [];
        const orders = ordRes.ok ? await ordRes.json() : [];

        const revenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
        setStats({ products: products.length, categories: categories.length, orders: orders.length, revenue });
        setRecentOrders(orders.slice(0, 10));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const statusColors: Record<string, string> = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    picking: 'bg-yellow-100 text-yellow-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-white animate-pulse" />)}
        </div>
        <div className="h-64 rounded-xl bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.products}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">📦</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Categories</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.categories}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">📁</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stats.orders}</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-xl">🛒</div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">₹{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl">💰</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Recent Orders</h2>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-5 py-3 text-left font-medium">Order ID</th>
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-5 py-3 text-left font-medium">Items</th>
                  <th className="px-5 py-3 text-left font-medium">Total</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3 text-gray-800">{order.user?.name || 'Unknown'}</td>
                    <td className="px-5 py-3 text-gray-600">{order.items?.length || 0} items</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">₹{order.total}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
