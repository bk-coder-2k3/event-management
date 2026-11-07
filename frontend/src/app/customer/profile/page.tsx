'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import { User, CheckCircle2, ShieldCheck, Mail, Phone } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await api.patch('/users/profile', {
        fullName,
        phone,
      });

      if (res.success) {
        setSuccess(true);
        await refreshUser();
      } else {
        setError(res.error?.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
          Personal Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage your contact information used when submitting enquiries to vendors.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your profile information has been saved successfully.</span>
            </div>
          )}

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
              placeholder="e.g. Priya Sundar"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                Email Address
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 border border-ivory-300 rounded-lg text-sm text-gray-500">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="flex-1">{user?.email}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400">Fixed</span>
              </div>
            </div>

            <Input
              label="Contact Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9842100000"
              helperText="Vendors will call or WhatsApp this number regarding your enquiries"
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={loading} size="sm">
                Save Changes
              </Button>
            </div>
          </form>

          {/* Member info */}
          <div className="pt-6 border-t border-ivory-200 flex items-center justify-between text-xs text-gray-500">
            <span>Account Type: <strong>Verified Customer</strong></span>
            <span>Registered: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '2026'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
