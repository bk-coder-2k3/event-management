'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        if (returnUrl) {
          router.push(returnUrl);
          return;
        }

        // Admin destination redirect
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <a
          href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000'}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-burgundy-700 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </a>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-gradient flex items-center justify-center text-gold-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-black text-burgundy-950">
          VizhaSpace Admin Center
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          Platform operator & super-administrator sign in
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-ivory-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link href="/forgot-password" className="text-burgundy-700 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold shadow-md">
              Sign In to Your Account
            </Button>
          </form>

          <div className="pt-4 border-t border-ivory-200 text-center space-y-2">
            <p className="text-xs text-gray-500">
              VizhaSpace Platform Administrative System (vizhaspace.in)
            </p>
            <p className="text-xs text-gray-500">
              <a
                href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000'}
                className="text-burgundy-700 font-semibold hover:underline"
              >
                Return to Public Marketplace
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-burgundy-700 rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
