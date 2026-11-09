'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api-client';
import { FolderTree, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>('/categories?includeInactive=true');
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setSortOrder('0');
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setSortOrder(String(cat.sortOrder));
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.success) {
        await loadCategories();
      } else {
        alert(res.error?.message || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      name,
      slug: slug || undefined,
      description,
      sortOrder: Number(sortOrder) || 0,
      isActive: true,
    };

    try {
      if (editingId) {
        const res = await api.patch(`/categories/${editingId}`, payload);
        if (res.success) {
          setIsModalOpen(false);
          await loadCategories();
        } else {
          setError(res.error?.message || 'Failed to update category');
        }
      } else {
        const res = await api.post('/categories', payload);
        if (res.success) {
          setIsModalOpen(false);
          await loadCategories();
        } else {
          setError(res.error?.message || 'Failed to create category');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
            Wedding Service Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage public directory categories, display hierarchy, and descriptions.
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Category Name & Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Active Vendors</th>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 text-sm block">{c.name}</span>
                        <code className="text-gray-400 text-[11px]">/{c.slug}</code>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 max-w-sm truncate">{c.description}</td>
                      <td className="py-3.5 px-4 font-semibold text-burgundy-900">
                        {c._count?.vendors ?? 0} Listings
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-mono">{c.sortOrder}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-gray-500 hover:text-burgundy-700 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-gray-500 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Create Category'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <Input
            label="Category Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Stage Decoration & Florals"
          />
          <Input
            label="URL Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. decoration (optional, auto-generated)"
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm"
              placeholder="Summary of this service..."
            />
          </div>
          <Input
            label="Display Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
