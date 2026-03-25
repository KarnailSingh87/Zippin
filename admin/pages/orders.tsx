import { useEffect, useState } from 'react';

const API = '';

const STATUSES = ['placed', 'confirmed', 'picking', 'out_for_delivery', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-purple-100 text-purple-700',
  picking: 'bg-yellow-100 text-yellow-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  async function load() {
    try {
      const url = filter ? `${API}/api/orders/all?status=${filter}` : `${API}/api/orders/all`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setOrders(await res.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(orderId: string, newStatus: string) {
    await fetch(`${API}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus, note: `Status updated to ${newStatus}` })
    });
    load();
    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    }
  }

  if (loading) return <div className="h-64 bg-white rounded-xl animate-pulse" />;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button onClick={() => setFilter('')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${!filter ? 'bg-admin-green text-white' : 'bg-white text-gray-600 border'}`}>
          All ({orders.length})
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize ${filter === s ? 'bg-admin-green text-white' : 'bg-white text-gray-600 border'}`}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 text-sm">No orders found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Items</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Payment</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800">{order.user?.name || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">₹{order.total}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{order.payment?.method || 'cod'}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border-0 cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="text-xs text-blue-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p><span className="text-gray-500">Customer:</span> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
                <p><span className="text-gray-500">Status:</span> <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[selectedOrder.status]}`}>{selectedOrder.status?.replace(/_/g, ' ').toUpperCase()}</span></p>
                <p><span className="text-gray-500">Payment:</span> {selectedOrder.payment?.method?.toUpperCase()} - {selectedOrder.payment?.status}</p>
                {selectedOrder.deliveryAddress && (
                  <p><span className="text-gray-500">Address:</span> {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Items ({selectedOrder.items?.length})</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">{item.qty}×</span>
                      <span className="flex-1">{item.name}</span>
                      <span className="font-semibold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{selectedOrder.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{selectedOrder.total}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
