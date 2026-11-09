'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api-client';
import { Sparkles, CheckCircle2 } from 'lucide-react';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error?.message || 'Password reset failed. Token may have expired.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-gradient flex items-center justify-center text-gold-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-black text-burgundy-950">
          Create New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-ivory-200 shadow-sm space-y-6">
          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-emerald-900">Password Successfully Updated</h3>
              <p className="text-xs text-gray-600">You can now sign in with your updated credentials.</p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-burgundy-700 text-white rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition"
              >
                Sign In Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}
              <Input
                label="Reset Security Token"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the reset token here"
              />
              <Input
                label="New Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 chars, 1 uppercase & 1 number"
              />
              <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-gold-400 border-t-burgundy-700 rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
