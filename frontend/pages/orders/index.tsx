import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const API = '';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/auth/login?redirect=/orders'); return; }
    async function load() {
      try {
        const res = await fetch(`${API}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
      } catch {}
      setLoading(false);
    }
    load();
  }, [token]);

  const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    placed: { color: 'bg-blue-100 text-blue-700', label: 'Order Placed', icon: '📦' },
    confirmed: { color: 'bg-purple-100 text-purple-700', label: 'Confirmed', icon: '✅' },
    picking: { color: 'bg-yellow-100 text-yellow-700', label: 'Picking Items', icon: '🛒' },
    out_for_delivery: { color: 'bg-orange-100 text-orange-700', label: 'Out for Delivery', icon: '🚴' },
    delivered: { color: 'bg-green-100 text-green-700', label: 'Delivered', icon: '✅' },
    cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled', icon: '❌' },
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl shimmer mb-3" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-20 md:pb-6 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-3">📦</span>
          <p className="font-medium">No orders yet</p>
          <button onClick={() => router.push('/')} className="btn-green mt-4 text-sm">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const sc = statusConfig[order.status] || statusConfig.placed;
            return (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-400">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${sc.color}`}>
                    {sc.icon} {sc.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item: any, i: number) => (
                      <img key={i} src={item.image || `https://placehold.co/32x32/f0f0f0/666?text=${i + 1}`}
                        className="w-8 h-8 rounded-lg object-contain bg-gray-50 border-2 border-white" alt="" />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border-2 border-white">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  <span className="text-sm font-bold text-gray-800">₹{order.total}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
