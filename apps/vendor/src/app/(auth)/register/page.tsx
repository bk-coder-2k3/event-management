'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function VendorRegisterPage() {
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
        role: 'VENDOR',
      });

      if (result.success) {
        router.push('/onboarding');
      } else {
        setError(result.error || 'Vendor registration failed.');
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
        <a
          href={process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000'}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-burgundy-700 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </a>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-950 flex items-center justify-center text-gold-400 shadow-lg border border-gold-500/30">
            <Building className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-black text-burgundy-950">
          Join as a VizhaSpace Partner
        </h2>
        <p className="mt-1 text-center text-xs text-gray-600">
          Grow your event & wedding business across Tamil Nadu on vizhaspace.in
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
              label="Contact Person Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sundararajan M"
            />

            <Input
              label="Business Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sundararajan@kalyanamandapam.com"
            />

            <Input
              label="Official Contact Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9842100000"
              helperText="10-digit Indian phone number"
            />

            <div className="relative">
              <Input
                label="Create Password"
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

            <Button type="submit" variant="gold" isLoading={loading} className="w-full py-3 text-sm font-bold shadow-md">
              Create Vendor Account & Continue &rarr;
            </Button>
          </form>

          <div className="pt-4 border-t border-ivory-200 text-center">
            <p className="text-xs text-gray-600">
              Already have a vendor account?{' '}
              <Link href="/login" className="text-burgundy-700 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
