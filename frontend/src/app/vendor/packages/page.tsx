'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api-client';
import { Package, Plus, Trash2, Edit3, Check, Sparkles } from 'lucide-react';

export default function VendorPackagesPage() {
  const [vendor, setVendor] = useState<any | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageName, setPackageName] = useState('');
  const [packageDesc, setPackageDesc] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [inclusionsText, setInclusionsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/vendors/me');
      if (res.success && res.data) {
        setVendor(res.data);
        setPackages(res.data.packages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPackageId(null);
    setPackageName('');
    setPackageDesc('');
    setPackagePrice('');
    setInclusionsText('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: any) => {
    setEditingPackageId(pkg.id);
    setPackageName(pkg.name);
    setPackageDesc(pkg.description);
    setPackagePrice(String(pkg.price));
    setInclusionsText(Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (packageId: string) => {
    if (!vendor) return;
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const res = await api.delete(`/vendors/${vendor.id}/packages/${packageId}`);
      if (res.success) {
        setPackages(packages.filter((p) => p.id !== packageId));
      } else {
        alert(res.error?.message || 'Failed to delete package');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete package');
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    setError(null);
    setSaving(true);

    const inclusions = inclusionsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (inclusions.length === 0) {
      setError('Please add at least one inclusion item');
      setSaving(false);
      return;
    }

    const payload = {
      name: packageName,
      description: packageDesc,
      price: Number(packagePrice),
      currency: 'INR',
      inclusions,
      isActive: true,
    };

    try {
      if (editingPackageId) {
        const res = await api.patch(`/vendors/${vendor.id}/packages/${editingPackageId}`, payload);
        if (res.success) {
          setIsModalOpen(false);
          await loadData();
        } else {
          setError(res.error?.message || 'Failed to update package');
        }
      } else {
        const res = await api.post(`/vendors/${vendor.id}/packages`, payload);
        if (res.success) {
          setIsModalOpen(false);
          await loadData();
        } else {
          setError(res.error?.message || 'Failed to create package');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
            Service Packages & Tiers ({packages.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Define standard packages (e.g., Muhurtham + Reception, Candid Photography, Deluxe Virundhu).
          </p>
        </div>
        <Button variant="gold" onClick={handleOpenCreate} className="flex items-center gap-1.5 shadow-md">
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-ivory-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col justify-between hover:border-gold-400 transition">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-serif font-bold text-lg text-burgundy-950">{pkg.name}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 text-gray-400 hover:text-burgundy-700 hover:bg-ivory-100 rounded-md transition"
                      title="Edit Package"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-2xl font-black text-gold-600">
                  ₹{Number(pkg.price).toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{pkg.description}</p>

                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <div className="pt-3 border-t border-ivory-100 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Included:
                    </span>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {pkg.inclusions.map((inc: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8 space-y-4">
          <Package className="w-12 h-12 text-gold-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-burgundy-900">No Packages Created</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Create transparent wedding packages so couples can understand what your services include.
          </p>
          <Button variant="primary" onClick={handleOpenCreate}>
            Create First Package
          </Button>
        </div>
      )}

      {/* Package Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPackageId ? 'Edit Package' : 'Create New Service Package'}
        maxWidth="md"
      >
        <form onSubmit={handleSavePackage} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Package Title"
            required
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="e.g. Traditional Muhurtham 2-Day Package"
          />

          <Input
            label="Package Price (₹)"
            type="number"
            required
            value={packagePrice}
            onChange={(e) => setPackagePrice(e.target.value)}
            placeholder="180000"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
              Package Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={packageDesc}
              onChange={(e) => setPackageDesc(e.target.value)}
              placeholder="Overview of this wedding package..."
              className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
              Package Inclusions (One per line) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={inclusionsText}
              onChange={(e) => setInclusionsText(e.target.value)}
              placeholder="Main AC Mandapam Hall&#10;10 Deluxe AC Guest Rooms&#10;24/7 Generator Backup&#10;Cleaning & Security Staff"
              className="w-full px-3 py-2 bg-white border border-ivory-300 rounded-lg text-sm font-mono text-xs"
            />
            <span className="text-[11px] text-gray-500 mt-1 block">Write each inclusion on a separate line.</span>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              {editingPackageId ? 'Save Changes' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
