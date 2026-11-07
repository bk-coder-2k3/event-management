'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register({
        fullName,
        email,
        phone,
        password,
        role: 'CUSTOMER',
      });

      if (result.success) {
        router.push('/customer/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please check inputs.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-burgundy-700 mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-gradient flex items-center justify-center text-gold-400 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-black text-burgundy-950">
          Create Customer Account
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          Save favorite vendors and send direct enquiries for your wedding
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
              label="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Anitha Sundar"
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anitha@example.com"
            />

            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9842100000"
              helperText="Optional 10-digit Indian phone number"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 chars, 1 uppercase & 1 number"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3 text-sm font-bold shadow-md">
              Create Account
            </Button>
          </form>

          <div className="pt-4 border-t border-ivory-200 text-center space-y-3">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-burgundy-700 font-bold hover:underline">
                Sign In
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Are you a service vendor?{' '}
              <Link href="/vendor/register" className="text-gold-700 font-bold hover:underline">
                Register as Vendor Partner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
