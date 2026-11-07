'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard,
  Building,
  Package,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const vendor = user?.vendorProfile;

  // Skip guard on registration / onboarding pages so new vendors can register
  const isPublicAuthRoute = pathname === '/vendor/register' || pathname === '/vendor/onboarding';
  if (isPublicAuthRoute) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Vendor Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', href: '/vendor/profile', icon: Building },
    { name: 'Pricing Packages', href: '/vendor/packages', icon: Package },
    { name: 'Portfolio Gallery', href: '/vendor/gallery', icon: ImageIcon },
    { name: 'Enquiries Inbox', href: '/vendor/enquiries', icon: MessageSquare },
    { name: 'Account Settings', href: '/vendor/settings', icon: Settings },
  ];

  return (
    <AuthGuard allowedRoles={['VENDOR', 'ADMIN']}>
      <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row">
        {/* Vendor Sidebar */}
        <aside className="w-full md:w-72 bg-burgundy-950 text-ivory-100 border-r border-burgundy-900 shrink-0 flex flex-col">
          {/* Header Brand */}
          <div className="p-6 border-b border-burgundy-900 bg-burgundy-900/40">
            <Link href="/" className="flex items-center gap-2 mb-4 group text-xs text-gold-400/80 hover:text-gold-300">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center font-bold text-burgundy-950 shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif font-bold text-ivory-50 truncate text-sm">
                  {vendor?.businessName || user?.fullName}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
                  Vendor Partner Portal
                </span>
              </div>
            </div>
          </div>

          {/* Verification / Approval status box */}
          <div className="px-5 py-3 mx-4 my-4 rounded-lg bg-burgundy-900/60 border border-burgundy-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-ivory-400">Profile Status:</span>
              {vendor?.approvalStatus === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Live
                </span>
              ) : vendor?.approvalStatus === 'REJECTED' ? (
                <span className="inline-flex items-center gap-1 font-bold text-red-400">
                  <AlertTriangle className="w-3 h-3" /> Rejected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                  <Clock className="w-3 h-3" /> Under Review
                </span>
              )}
            </div>
            {vendor?.slug && vendor.approvalStatus === 'APPROVED' && (
              <Link
                href={`/vendors/${vendor.slug}`}
                target="_blank"
                className="mt-2 text-[11px] text-gold-300 hover:text-gold-200 flex items-center gap-1 font-medium"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Navigation */}
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
                      ? 'bg-gold-500 text-burgundy-950 font-bold shadow-md'
                      : 'text-ivory-300 hover:bg-burgundy-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-burgundy-950' : 'text-gold-400/80'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-burgundy-900">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3.5 py-2 text-sm text-red-400 hover:bg-red-950/40 rounded-lg transition"
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
