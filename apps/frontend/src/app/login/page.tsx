// ============================================
// SMART LINK HUB - Login Page
// JWT authentication login form
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#000000' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              <span style={{ color: 'var(--accent)' }}>Smart</span>
              <span style={{ color: 'var(--foreground)' }}> Link Hub</span>
            </h1>
          </Link>
          <p style={{ color: 'var(--foreground-secondary)' }} className="mt-2">Sign in to manage your hubs</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="panel p-8">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Welcome back</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-2" style={{ color: 'var(--foreground-secondary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <p className="text-center mt-6" style={{ color: 'var(--foreground-secondary)' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)' }} className="hover:underline">
              Create one
            </Link>
          </p>
        </form>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link href="/" style={{ color: 'var(--foreground-secondary)' }} className="text-sm hover:opacity-80">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

