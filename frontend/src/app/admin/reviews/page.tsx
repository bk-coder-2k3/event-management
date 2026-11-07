'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { api } from '@/lib/api-client';
import { Star, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('PENDING');

  const loadReviews = async () => {
    try {
      setLoading(true);
      const query = filterStatus !== 'ALL' ? `?moderationStatus=${filterStatus}` : '';
      const res = await api.get<any[]>(`/admin/reviews${query}`);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filterStatus]);

  const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.patch(`/reviews/${reviewId}/moderate`, {
        moderationStatus: status,
      });
      if (res.success) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
      } else {
        alert(res.error?.message || 'Failed to moderate review');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
            Customer Reviews Moderation ({reviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ensure customer feedback is genuine, constructive, and adheres to Tamil Nadu marketplace guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold"
          >
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved & Public</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All Reviews</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="overflow-hidden">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">
                      {rev.customer?.fullName} ({rev.customer?.email})
                    </span>
                    <span>&rarr;</span>
                    <Link
                      href={`/vendors/${rev.vendor?.slug}`}
                      className="font-serif font-bold text-burgundy-900 hover:underline text-sm"
                    >
                      {rev.vendor?.businessName}
                    </Link>
                    <Badge
                      variant={
                        rev.moderationStatus === 'APPROVED'
                          ? 'success'
                          : rev.moderationStatus === 'REJECTED'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {rev.moderationStatus}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating rating={rev.rating} size="sm" />
                    <span className="text-xs font-bold text-gray-700">{rev.rating} / 5 Stars</span>
                    <span className="text-xs text-gray-400">
                      &bull; {new Date(rev.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rev.moderationStatus !== 'APPROVED' && (
                    <button
                      onClick={() => handleModerate(rev.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {rev.moderationStatus !== 'REJECTED' && (
                    <button
                      onClick={() => handleModerate(rev.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border p-8 text-gray-500 text-sm">
          No reviews waiting in this queue.
        </div>
      )}
    </div>
  );
}
