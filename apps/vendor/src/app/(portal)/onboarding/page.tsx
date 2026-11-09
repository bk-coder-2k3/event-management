'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { api } from '@/lib/api-client';
import { Building, Sparkles } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@vizhaspace/shared';
import { CategoryFieldsRenderer } from '@/components/vendor/CategoryFieldsRenderer';

export default function VendorOnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    businessName: '',
    categoryId: '',
    description: '',
    startingPrice: '',
    address: '',
    city: 'Madurai',
    district: 'Madurai',
    postalCode: '',
    phone: user?.phone || '',
    whatsappPhone: user?.phone || '',
  });

  const [categoryAttributes, setCategoryAttributes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get<any[]>('/categories');
        if (res.success && res.data) {
          const list = res.data;
          setCategories(list);
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: list[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...formData,
        startingPrice: formData.startingPrice ? Number(formData.startingPrice) : null,
        attributes: categoryAttributes,
      };

      const res = await api.post('/vendors', payload);
      if (res.success) {
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError(res.error?.message || 'Failed to submit vendor profile.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-burgundy-950 flex items-center justify-center text-gold-400 mx-auto shadow-md border border-gold-500/30">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="mt-4 font-serif text-3xl font-black text-burgundy-950">
            Set Up Your Event & Celebration Business Profile
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Provide your business and service details for weddings, parties, and corporate events. Once submitted, our team will review and verify your listing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business / Venue Name"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sri Meenakshi Grand Palace & Banquets"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                    Event Service Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                  About Your Services & Heritage <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your seating capacity, dining hall, air-conditioning, experience, style, or catering specialties (min 20 characters)..."
                  className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Starting Package / Price (₹)"
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  placeholder="e.g. 150000"
                  helperText="Minimum base price for hall rental or base service package"
                />

                <Input
                  label="WhatsApp Business Contact"
                  value={formData.whatsappPhone}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  placeholder="e.g. 9842100000"
                  helperText="Couples will be able to message you directly on this number"
                />
              </div>

              {/* Dynamic Category-Specific Attributes */}
              {(() => {
                const selectedCategory = categories.find((c) => c.id === formData.categoryId);
                if (!selectedCategory) return null;
                return (
                  <div className="pt-2">
                    <CategoryFieldsRenderer
                      categorySlug={selectedCategory.slug}
                      attributes={categoryAttributes}
                      onChange={(key, val) =>
                        setCategoryAttributes((prev) => ({ ...prev, [key]: val }))
                      }
                    />
                  </div>
                );
              })()}

              {/* Location details */}
              <div className="pt-4 border-t border-ivory-200 space-y-4">
                <h3 className="font-serif font-bold text-base text-burgundy-900">Location & Address</h3>

                <Input
                  label="Street Address / Landmark"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 42 West Veli Street, Near Temple"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City / Town"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Madurai"
                  />

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
                      District <span className="text-red-500">*</span>
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
                    label="PIN Code"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="625001"
                    helperText="6-digit PIN code"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" isLoading={loading} className="w-full py-3.5 text-sm font-bold shadow-md">
                  Submit Profile for Verification
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
