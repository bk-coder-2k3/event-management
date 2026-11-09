'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import { UploadCloud, Trash2, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

export default function VendorGalleryPage() {
  const [vendor, setVendor] = useState<any | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>('/vendors/me');
      if (res.success && res.data) {
        setVendor(res.data);
        setImages(res.data.images || []);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('altText', `${vendor.businessName} portfolio photo`);

      const res = await api.post(`/vendors/${vendor.id}/images`, formData);
      if (res.success && res.data) {
        setImages([...images, res.data]);
      } else {
        setError(res.error?.message || 'Failed to upload image');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!vendor) return;
    if (!confirm('Are you sure you want to remove this photo?')) return;

    try {
      const res = await api.delete(`/vendors/${vendor.id}/images/${imageId}`);
      if (res.success) {
        setImages(images.filter((img) => img.id !== imageId));
      } else {
        alert(res.error?.message || 'Failed to delete photo');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
            Portfolio Gallery ({images.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Upload high quality photographs of your stage decorations, marriage hall, feast virundhu, or makeup work.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <Button
            variant="gold"
            isLoading={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 shadow-md"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Photo</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gold-400/60 rounded-3xl p-8 bg-gold-50/20 hover:bg-gold-50/50 text-center cursor-pointer transition"
      >
        <UploadCloud className="w-10 h-10 text-gold-600 mx-auto mb-2" />
        <h4 className="font-serif font-bold text-burgundy-900 text-base">Click to Upload Portfolio Photos</h4>
        <p className="text-xs text-gray-500 mt-1">Supported formats: JPEG, PNG, WEBP (Max 5MB each)</p>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-ivory-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="relative group rounded-2xl overflow-hidden bg-ivory-200 border border-ivory-200 shadow-sm h-48"
            >
              <img src={img.imageUrl} alt={img.altText || ''} className="w-full h-full object-cover" />

              {/* Cover badge on first image */}
              {idx === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-burgundy-900/90 text-gold-300 font-bold text-[10px] rounded-full">
                  Primary Cover
                </div>
              )}

              {/* Hover Overlay with Delete */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow transition"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 text-sm">
          No portfolio photos uploaded yet. High quality photos increase customer enquiries by 400%!
        </div>
      )}
    </div>
  );
}
