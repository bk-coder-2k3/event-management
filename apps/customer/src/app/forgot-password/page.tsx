'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api-client';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetTokenPreview, setResetTokenPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<any>('/auth/forgot-password', { email });
      if (res.success && res.data) {
        setMessage(res.data.message || 'If an account exists, a reset link will be sent.');
        if (res.data.resetToken) {
          setResetTokenPreview(res.data.resetToken);
        }
      } else {
        setError(res.error?.message || 'Failed to process password reset.');
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
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-burgundy-700 mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-gradient flex items-center justify-center text-gold-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-black text-burgundy-950">
          Reset Your Password
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-ivory-200 shadow-sm space-y-6">
          {message ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-sm text-gray-700">{message}</p>
              {resetTokenPreview && (
                <div className="p-3 bg-gold-50 border border-gold-300 rounded-lg text-left">
                  <span className="text-[10px] uppercase font-bold text-gold-900 block">Development Reset Token:</span>
                  <code className="text-xs text-burgundy-900 break-all select-all">{resetTokenPreview}</code>
                  <Link
                    href={`/reset-password?token=${resetTokenPreview}`}
                    className="block mt-2 text-xs text-burgundy-700 font-bold hover:underline"
                  >
                    Click to proceed with resetting password &rarr;
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}
              <Input
                label="Registered Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="priya@example.com"
              />
              <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
