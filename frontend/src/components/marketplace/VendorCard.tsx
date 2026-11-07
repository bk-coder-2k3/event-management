'use client';

import React from 'react';
import Link from 'next/link';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { MapPin, ShieldCheck, Heart } from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';

export interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    slug: string;
    city: string;
    district: string;
    startingPrice?: number | string | null;
    currency?: string;
    verificationStatus?: string;
    category?: { name: string; slug: string };
    images?: Array<{ imageUrl: string; altText?: string | null }>;
    avgRating?: number;
    reviewCount?: number;
    isSaved?: boolean;
  };
  onToggleSave?: () => void;
}

export function VendorCard({ vendor, onToggleSave }: VendorCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(Boolean(vendor.isSaved));
  const [saving, setSaving] = React.useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
  const coverImage = vendor.images && vendor.images.length > 0 ? vendor.images[0].imageUrl : fallbackImage;

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = `/login?returnUrl=/vendors/${vendor.slug}`;
      return;
    }

    try {
      setSaving(true);
      if (isSaved) {
        await api.delete(`/users/saved-vendors/${vendor.id}`);
        setIsSaved(false);
      } else {
        await api.post(`/users/saved-vendors/${vendor.id}`);
        setIsSaved(true);
      }
      onToggleSave?.();
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

  const formattedPrice =
    vendor.startingPrice !== undefined && vendor.startingPrice !== null
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
          Number(vendor.startingPrice)
        )
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-ivory-200 overflow-hidden shadow-sm hover:shadow-wedding-lg hover:border-gold-300 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-ivory-200">
        <img
          src={coverImage}
          alt={vendor.businessName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge */}
        {vendor.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-burgundy-900/80 backdrop-blur-md text-gold-300 font-semibold text-xs rounded-full border border-gold-500/30">
              {vendor.category.name}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-burgundy-700 shadow-md transition"
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-burgundy-700 text-burgundy-700' : ''}`} />
        </button>

        {/* Price Tag Overlay at Bottom Left */}
        {formattedPrice && (
          <div className="absolute bottom-3 left-3 text-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ivory-300 block">Starting From</span>
            <span className="text-lg font-bold text-gold-300 drop-shadow">{formattedPrice}</span>
          </div>
        )}

        {/* Verified Badge at Bottom Right */}
        {vendor.verificationStatus === 'VERIFIED' && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        )}
      </div>

      {/* Vendor Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1 text-gray-600 truncate">
              <MapPin className="w-3.5 h-3.5 text-burgundy-600 shrink-0" />
              <span className="truncate">{vendor.city}, {vendor.district}</span>
            </div>
            {vendor.reviewCount !== undefined && vendor.reviewCount > 0 ? (
              <div className="flex items-center gap-1 font-semibold text-gray-800 shrink-0">
                <StarRating rating={vendor.avgRating || 5} size="sm" />
                <span className="text-xs font-bold text-burgundy-900">
                  {vendor.avgRating} ({vendor.reviewCount})
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-gray-400">New on KalyanaConnect</span>
            )}
          </div>

          {/* Business Title */}
          <Link href={`/vendors/${vendor.slug}`} className="block">
            <h3 className="font-serif text-lg font-bold text-burgundy-950 group-hover:text-burgundy-700 line-clamp-1 transition">
              {vendor.businessName}
            </h3>
          </Link>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-ivory-200 flex items-center justify-between">
          <Link
            href={`/vendors/${vendor.slug}`}
            className="w-full py-2.5 text-center text-sm font-semibold text-burgundy-900 bg-ivory-200 hover:bg-gold-500 hover:text-burgundy-950 rounded-lg transition"
          >
            Explore Profile & Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
