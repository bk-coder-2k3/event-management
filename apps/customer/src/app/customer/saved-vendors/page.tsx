'use client';

import React, { useEffect, useState } from 'react';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { VendorCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export default function CustomerSavedVendorsPage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>('/users/saved-vendors');
      if (res.success && res.data) {
        setSavedItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedVendors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
            My Saved Wedding Team ({savedItems.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Keep your preferred marriage halls, photographers, and caterers bookmarked for quick comparison.
          </p>
        </div>
        <Link
          href="/vendors"
          className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-700 text-white rounded-lg text-xs font-semibold hover:bg-burgundy-800 transition"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse More</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <VendorCardSkeleton key={i} />
          ))}
        </div>
      ) : savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => (
            <VendorCard
              key={item.id}
              vendor={{ ...item.vendor, isSaved: true }}
              onToggleSave={fetchSavedVendors}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8 space-y-4">
          <Heart className="w-12 h-12 text-gold-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-burgundy-900">Your Wishlist is Empty</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            Click the heart icon on any vendor card to save them to your wedding shortlist.
          </p>
          <Link
            href="/vendors"
            className="inline-block px-6 py-2.5 bg-burgundy-700 text-white rounded-xl text-xs font-bold hover:bg-burgundy-800 transition shadow-md"
          >
            Explore Vendors in Madurai
          </Link>
        </div>
      )}
    </div>
  );
}
