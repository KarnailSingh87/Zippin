import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, phone, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1 mb-3">
              <span className="text-3xl font-black text-blinkit-green">blink</span>
              <span className="text-3xl font-black text-blinkit-yellow">it</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Get groceries delivered in 10 minutes</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4 text-sm text-red-700 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blinkit-green focus:border-transparent" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blinkit-green text-white py-3 rounded-xl font-bold text-sm hover:bg-blinkit-green-dark transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blinkit-green font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
