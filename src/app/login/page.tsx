// ============================================
// SMART LINK HUB - Login Page
// JWT authentication login form
// With micro-animations and premium styling
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api-client';
import ThemeToggle from '@/components/ThemeToggle';

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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background gradient */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 200, 83, 0.2) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <h1 className="text-3xl font-bold">
              <span className="text-[#00C853]">Smart</span>
              <span className="text-[#E6E6E6]"> Link Hub</span>
            </h1>
          </Link>
          <p className="text-[#9A9A9A] mt-2">Sign in to manage your hubs</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#111] border border-[#222] rounded-2xl p-8 animate-scale-in"
        >
          <h2 className="text-xl font-bold mb-6 text-[#E6E6E6]">Welcome back</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm mb-2 text-[#9A9A9A]">
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
            <label htmlFor="password" className="block text-sm mb-2 text-[#9A9A9A]">
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
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <p className="text-center mt-6 text-[#9A9A9A]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#00C853] hover:underline transition-colors">
              Create one
            </Link>
          </p>
        </form>

        {/* Back to Home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-[#9A9A9A] hover:text-[#E6E6E6] transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
