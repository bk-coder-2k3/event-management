'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { VendorCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import { Sparkles, MapPin, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<any | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catRes, vendorsRes] = await Promise.all([
          api.get<any>(`/categories/${slug}`),
          api.get<any[]>(`/vendors?category=${slug}&limit=20`),
        ]);

        if (catRes.success && catRes.data) {
          setCategory(catRes.data);
        }
        if (vendorsRes.success && vendorsRes.data) {
          setVendors(vendorsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-ivory-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-burgundy-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/vendors" className="hover:text-burgundy-700">Categories</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-burgundy-900 font-semibold">{category?.name || slug}</span>
        </div>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-burgundy-950 text-white py-14 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy-900 rounded-full text-gold-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Tamil Nadu Wedding Services
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50">
            {category?.name || 'Wedding Category'}
          </h1>
          <p className="mt-3 text-sm text-ivory-300 max-w-2xl">
            {category?.description || 'Browse certified providers in Madurai and across Tamil Nadu.'}
          </p>
        </div>
      </div>

      {/* Main Vendor Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-ivory-200">
          <div className="text-xs text-gray-600 font-medium">
            Showing <strong>{vendors.length}</strong> providers in {category?.name}
          </div>
          <Link
            href="/vendors"
            className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>All Categories</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8">
            <MapPin className="w-10 h-10 text-gold-500 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-burgundy-900 mb-1">
              No Listings in {category?.name || 'this category'} yet
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              Wedding service providers in this category are currently being verified by our administration team.
            </p>
            <Link
              href="/vendors"
              className="px-6 py-2.5 bg-burgundy-700 text-white rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition"
            >
              Browse All Vendors
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
