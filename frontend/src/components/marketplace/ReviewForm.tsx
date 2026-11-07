'use client';

import React, { useState } from 'react';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';
import { CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export function ReviewForm({
  vendorId,
  vendorName,
  onReviewSubmitted,
}: {
  vendorId: string;
  vendorName: string;
  onReviewSubmitted?: () => void;
}) {
  const { user, isCustomer } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="p-6 bg-ivory-50 border border-ivory-200 rounded-xl text-center">
        <Lock className="w-6 h-6 text-burgundy-700 mx-auto mb-2" />
        <h4 className="font-serif font-bold text-burgundy-900 mb-1">Have you used {vendorName}'s services?</h4>
        <p className="text-xs text-gray-600 mb-4">Please sign in as a customer to leave a verified rating and review.</p>
        <Link
          href={`/login?returnUrl=/vendors/${vendorId}`}
          className="inline-block px-5 py-2 bg-burgundy-700 text-white rounded-lg text-xs font-semibold hover:bg-burgundy-800 transition"
        >
          Sign In to Review
        </Link>
      </div>
    );
  }

  if (!isCustomer && user.role !== 'ADMIN') {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 text-center">
        Reviews can only be submitted by verified customer accounts.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/reviews', {
        vendorId,
        rating,
        comment,
      });

      if (res.success) {
        setSuccess(true);
        setComment('');
        onReviewSubmitted?.();
      } else {
        setError(res.error?.message || 'Failed to submit review.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
        <h4 className="font-serif font-bold text-emerald-900 mb-1">Review Submitted For Moderation</h4>
        <p className="text-xs text-emerald-700">
          Thank you for sharing your experience! To keep reviews authentic and spam-free, your review will be published upon quick admin moderation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-ivory-200 rounded-xl shadow-sm space-y-4">
      <h4 className="font-serif text-lg font-bold text-burgundy-900">Write a Review for {vendorName}</h4>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1">
          Your Overall Rating
        </label>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} size="lg" interactive onRatingChange={setRating} />
          <span className="text-sm font-bold text-burgundy-900">{rating} out of 5 stars</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1">
          Your Feedback & Experience <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe punctuality, quality of decoration/food/photos, and professionalism..."
          className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-500"
        />
      </div>

      <Button type="submit" variant="primary" isLoading={loading} size="sm">
        Submit Verified Review
      </Button>
    </form>
  );
}
