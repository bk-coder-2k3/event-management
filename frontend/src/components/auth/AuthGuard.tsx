'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@kalyanaconnect/shared';
import { Sparkles, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gold-300 border-t-burgundy-700 rounded-full animate-spin" />
          <Sparkles className="w-6 h-6 text-gold-500 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-burgundy-900 font-serif text-lg tracking-wide">
          Verifying KalyanaConnect Session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-burgundy-700 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-burgundy-900 font-bold mb-2">Access Restricted</h2>
        <p className="text-gray-600 max-w-md mb-6">
          This portal requires a <strong>{allowedRoles.join(' or ')}</strong> account. You are currently signed in as a{' '}
          <strong>{role}</strong>.
        </p>
        <div className="flex gap-4">
          <Link
            href={
              role === 'ADMIN'
                ? '/admin/dashboard'
                : role === 'VENDOR'
                ? '/vendor/dashboard'
                : '/customer/dashboard'
            }
            className="px-6 py-2.5 bg-burgundy-700 text-white rounded-lg hover:bg-burgundy-800 transition font-medium text-sm shadow-md"
          >
            Go to Your Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border border-gold-500 text-gold-700 rounded-lg hover:bg-gold-50 transition font-medium text-sm"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
