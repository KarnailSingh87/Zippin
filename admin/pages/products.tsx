import { useEffect, useState } from 'react';

const API = '';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', slug: '', price: '', mrp: '', unit: '', stock: '', category: '', description: '',
    isFeatured: false, isAvailable: true, discount: '', tags: ''
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  async function load() {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API}/api/products?limit=999`),
        fetch(`${API}/api/categories`)
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditId(null);
    setForm({ title: '', slug: '', price: '', mrp: '', unit: '', stock: '', category: '', description: '', isFeatured: false, isAvailable: true, discount: '', tags: '' });
    setShowModal(true);
  }

  function openEdit(p: any) {
    setEditId(p._id);
    setForm({
      title: p.title, slug: p.slug || '', price: String(p.price), mrp: String(p.mrp || ''),
      unit: p.unit || '', stock: String(p.stock || 0), category: p.category?._id || p.category || '',
      description: p.description || '', isFeatured: p.isFeatured || false, isAvailable: p.isAvailable !== false,
      discount: String(p.discount || ''), tags: (p.tags || []).join(', ')
    });
    setShowModal(true);
  }

  async function handleSave() {
    const body = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp) || Number(form.price),
      stock: Number(form.stock) || 0,
      discount: Number(form.discount) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      images: [{ url: `https://placehold.co/300x300/E8F5E9/333?text=${encodeURIComponent(form.title.split(' ')[0])}`, publicId: '' }]
    };

    const url = editId ? `${API}/api/products/${editId}` : `${API}/api/products`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    setShowModal(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    await fetch(`${API}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    load();
  }

  if (loading) return <div className="h-64 bg-white rounded-xl animate-pulse" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{products.length} products</p>
        <button onClick={openNew} className="bg-admin-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-admin-green-dark transition-colors">
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.images?.[0]?.url ? (
                        <img 
                          src={p.images[0].url} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('hidden');
                          }}
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 shrink-0" 
                          alt="" 
                        />
                      ) : null}
                      <div 
                        hidden={!!p.images?.[0]?.url}
                        className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-xl shrink-0 border border-green-100"
                      >
                        {p.title.toLowerCase().includes('tomato') ? '🍅' : 
                         p.title.toLowerCase().includes('onion') ? '🧅' : 
                         p.title.toLowerCase().includes('potato') ? '🥔' :
                         p.title.toLowerCase().includes('milk') ? '🥛' :
                         p.title.toLowerCase().includes('bread') ? '🍞' :
                         p.title.toLowerCase().includes('chips') ? '🍟' :
                         p.title.toLowerCase().includes('noodles') ? '🍜' :
                         p.title.toLowerCase().includes('maggi') ? '🍜' : '📦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                        <p className="text-xs text-gray-400">{p.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.category?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold">₹{p.price}</span>
                    {p.mrp > p.price && <span className="text-xs text-gray-400 line-through ml-1">₹{p.mrp}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                    {p.isFeatured && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 ml-1">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? 'Edit Product' : 'Add Product'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">MRP</label>
                  <input type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Unit</label>
                  <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="e.g. 500 g"
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="milk, dairy, amul"
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-admin-green" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-admin-green" />
                  Available
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-600">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-admin-green text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-admin-green-dark">
                {editId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
