import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-ivory-200/80 rounded-lg animate-pulse shimmer-wrapper ${className}`}
    />
  );
}

export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-ivory-200 overflow-hidden shadow-sm p-4 space-y-4">
      <Skeleton className="w-full h-48 rounded-lg" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-12 h-4 rounded" />
        </div>
        <Skeleton className="w-3/4 h-6 rounded" />
        <Skeleton className="w-1/2 h-4 rounded" />
      </div>
      <div className="pt-3 border-t border-ivory-100 flex justify-between items-center">
        <Skeleton className="w-20 h-5 rounded" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
}
