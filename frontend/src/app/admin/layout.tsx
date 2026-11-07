'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard,
  Store,
  FolderTree,
  Users,
  Star,
  ShieldAlert,
  LogOut,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Platform Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vendor Applications', href: '/admin/vendors', icon: Store },
    { name: 'Service Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Security Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
  ];

  return (
    <AuthGuard allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Admin Executive Sidebar */}
        <aside className="w-full md:w-72 bg-[#1a0c10] text-gray-200 border-r border-[#2d151c] shrink-0 flex flex-col">
          <div className="p-6 border-b border-[#2d151c] bg-[#14080b]">
            <Link href="/" className="flex items-center gap-2 mb-4 group text-xs text-gray-400 hover:text-gold-400">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient text-burgundy-950 flex items-center justify-center font-bold shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif font-bold text-white truncate text-sm">
                  KalyanaConnect
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admin Console
                </span>
              </div>
            </div>
          </div>

          {/* Admin User Badge */}
          <div className="px-5 py-3 mx-4 my-4 rounded-lg bg-[#261017] border border-[#3b1c24] text-xs">
            <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Super Administrator</span>
            <span className="font-semibold text-gold-300 truncate block mt-0.5">{user?.email}</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-burgundy-700 text-white font-bold shadow-md'
                      : 'text-gray-300 hover:bg-[#2a131b] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4 border-t border-[#2d151c]">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3.5 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
