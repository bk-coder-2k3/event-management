'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard Overview', href: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Enquiries', href: '/customer/enquiries', icon: MessageSquare },
    { name: 'Saved Wishlist', href: '/customer/saved-vendors', icon: Heart },
    { name: 'My Profile', href: '/customer/profile', icon: User },
  ];

  return (
    <AuthGuard allowedRoles={['CUSTOMER', 'ADMIN']}>
      <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row">
        {/* Customer Portal Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-ivory-200 shrink-0">
          <div className="p-6 border-b border-ivory-200 bg-ivory-50/60">
            <Link href="/" className="flex items-center gap-2 mb-4 group text-xs text-gray-500 hover:text-burgundy-700">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy-100 text-burgundy-800 flex items-center justify-center font-bold text-base">
                {user?.fullName?.charAt(0) || 'C'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif font-bold text-burgundy-900 truncate text-sm">
                  {user?.fullName}
                </h3>
                <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-burgundy-50 text-burgundy-700 rounded border border-burgundy-200">
                  Customer Portal
                </span>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-ivory-200 hover:text-burgundy-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-ivory-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
