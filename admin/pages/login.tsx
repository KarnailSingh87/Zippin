import { useState } from 'react';
import { useRouter } from 'next/router';

const API = '';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (!data.user.roles?.includes('admin')) throw new Error('Admin access required');
      localStorage.setItem('admin_token', data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-admin-sidebar to-gray-900 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-3xl font-black text-admin-green">blink</span>
              <span className="text-3xl font-black text-admin-yellow">it</span>
            </div>
            <p className="text-xs bg-gray-100 inline-block px-3 py-1 rounded-full font-bold text-gray-600">ADMIN PANEL</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@blinkit.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-admin-green" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-admin-green text-white py-3 rounded-xl font-bold text-sm hover:bg-admin-green-dark transition-colors disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login to Admin'}
            </button>
          </form>

          <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
            <p className="font-semibold text-gray-600 mb-1">Default Admin:</p>
            <p>Email: <span className="font-mono text-admin-green">admin@blinkit.com</span></p>
            <p>Password: <span className="font-mono text-admin-green">admin123</span></p>
            <p className="mt-1 text-[10px]">Seed first: POST /api/internal/seed-admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
