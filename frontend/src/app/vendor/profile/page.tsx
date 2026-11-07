'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@kalyanaconnect/shared';

export default function VendorProfileEditPage() {
  const { user, refreshUser } = useAuth();
  const [vendor, setVendor] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    startingPrice: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    phone: '',
    whatsappPhone: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVendor() {
      try {
        setLoading(true);
        const res = await api.get<any>('/vendors/me');
        if (res.success && res.data) {
          setVendor(res.data);
          setFormData({
            businessName: res.data.businessName || '',
            description: res.data.description || '',
            startingPrice: res.data.startingPrice ? String(res.data.startingPrice) : '',
            address: res.data.address || '',
            city: res.data.city || 'Madurai',
            district: res.data.district || 'Madurai',
            postalCode: res.data.postalCode || '',
            phone: res.data.phone || '',
            whatsappPhone: res.data.whatsappPhone || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadVendor();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await api.patch(`/vendors/${vendor.id}`, {
        ...formData,
        startingPrice: formData.startingPrice ? Number(formData.startingPrice) : null,
      });

      if (res.success) {
        setSuccess(true);
        await refreshUser();
      } else {
        setError(res.error?.message || 'Failed to update vendor profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading business profile...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
          Edit Business Profile
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Keep your listing details, photos, and contact numbers accurate for couples in Tamil Nadu.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Public Information</CardTitle>
          {vendor?.verificationStatus === 'VERIFIED' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Listing
            </span>
          )}
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Business profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Name"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />

              <Input
                label="Starting Price (₹)"
                type="number"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                placeholder="150000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                Service Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Contact"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="WhatsApp Business Number"
                value={formData.whatsappPhone}
                onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                helperText="Enables direct WhatsApp chats from customers"
              />
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-ivory-200 space-y-4">
              <h3 className="font-serif font-bold text-base text-burgundy-900">Address & District</h3>

              <Input
                label="Street Address / Landmark"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Postal PIN Code"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" isLoading={saving} className="px-8">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
