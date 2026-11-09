'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Heart,
  Menu,
  X,
  MapPin,
  Sparkles,
  ChevronDown,
  Building,
  User,
  LogOut,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@vizhaspace/shared';

export function Navbar() {
  const { user, role, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState('Madurai');

  const VENDOR_PORTAL_URL = process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3001';
  const ADMIN_PORTAL_URL = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ivory-200 transition-all">
      {/* Top micro-bar with Tamil Nadu cultural motif & district selector */}
      <div className="bg-burgundy-900 text-ivory-100 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-medium tracking-wide">
            Tamil Nadu's Premier All-Event & Wedding Services Network &bull; vizhaspace.in
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <MapPin className="w-3 h-3 text-gold-400" />
          <span className="text-ivory-300">City / District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              window.location.href = `/vendors?district=${encodeURIComponent(e.target.value)}`;
            }}
            className="bg-burgundy-950/80 text-gold-300 text-xs px-2 py-0.5 rounded border border-burgundy-700 focus:outline-none cursor-pointer"
          >
            {TAMIL_NADU_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-burgundy-gradient flex items-center justify-center text-gold-400 shadow-md group-hover:shadow-wedding transition duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-black tracking-tight text-burgundy-900 block group-hover:text-burgundy-700 transition">
                Vizha<span className="text-gold-600">Space</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-burgundy-600 block -mt-1">
                vizhaspace.in
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/vendors"
              className="text-sm font-semibold text-gray-700 hover:text-burgundy-700 transition flex items-center gap-1"
            >
              <Search className="w-4 h-4 text-gold-600" />
              Find Vendors
            </Link>
            <Link
              href="/categories/venues"
              className="text-sm font-semibold text-gray-700 hover:text-burgundy-700 transition"
            >
              Venues & Halls
            </Link>
            <Link
              href="/categories/photography"
              className="text-sm font-semibold text-gray-700 hover:text-burgundy-700 transition"
            >
              Photography
            </Link>
            <Link
              href="/categories/catering"
              className="text-sm font-semibold text-gray-700 hover:text-burgundy-700 transition"
            >
              Catering
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <a
                  href={`${VENDOR_PORTAL_URL}/register`}
                  className="text-xs font-semibold uppercase tracking-wider text-burgundy-800 hover:text-burgundy-950 px-3 py-1.5 border border-gold-400 rounded-lg bg-gold-50/50 hover:bg-gold-50 transition"
                >
                  List Your Business
                </a>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-burgundy-700 text-white rounded-lg text-sm font-medium hover:bg-burgundy-800 shadow-sm transition"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {role === 'CUSTOMER' && (
                  <>
                    <Link
                      href="/customer/saved-vendors"
                      className="p-2 text-gray-600 hover:text-burgundy-700 hover:bg-ivory-100 rounded-full transition"
                      title="Saved Vendors"
                    >
                      <Heart className="w-5 h-5 text-burgundy-600" />
                    </Link>
                    <Link
                      href="/customer/dashboard"
                      className="flex items-center gap-2 px-3 py-1.5 bg-ivory-100 border border-ivory-300 rounded-lg hover:border-gold-400 transition"
                    >
                      <User className="w-4 h-4 text-burgundy-700" />
                      <span className="text-sm font-semibold text-burgundy-950">
                        {user.fullName.split(' ')[0]}
                      </span>
                    </Link>
                  </>
                )}

                {role === 'VENDOR' && (
                  <a
                    href={`${VENDOR_PORTAL_URL}/dashboard`}
                    className="flex items-center gap-2 px-4 py-2 bg-burgundy-50 border border-burgundy-200 text-burgundy-800 rounded-lg hover:bg-burgundy-100 transition font-medium text-sm"
                  >
                    <Building className="w-4 h-4 text-gold-600" />
                    <span>Vendor Dashboard</span>
                    {user.vendorProfile?.approvalStatus === 'APPROVED' ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Approved" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Pending Approval" />
                    )}
                  </a>
                )}

                {role === 'ADMIN' && (
                  <a
                    href={`${ADMIN_PORTAL_URL}/dashboard`}
                    className="flex items-center gap-2 px-4 py-2 bg-burgundy-900 text-gold-300 rounded-lg hover:bg-burgundy-950 transition font-medium text-sm shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>Admin Control Center</span>
                  </a>
                )}

                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-burgundy-900 rounded-lg hover:bg-ivory-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-ivory-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/vendors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-burgundy-700"
          >
            Find Wedding Vendors
          </Link>
          <Link
            href="/categories/venues"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-burgundy-700"
          >
            Kalyana Mandapams
          </Link>
          <Link
            href="/categories/photography"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-burgundy-700"
          >
            Photography & Drone Films
          </Link>
          <Link
            href="/categories/catering"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-burgundy-700"
          >
            Traditional Catering & Feast
          </Link>
          <div className="pt-4 border-t border-ivory-200 space-y-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center bg-burgundy-700 text-white rounded-lg font-medium"
                >
                  Sign In
                </Link>
                <a
                  href={`${VENDOR_PORTAL_URL}/register`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center border border-gold-500 text-gold-800 rounded-lg font-semibold"
                >
                  List Your Business
                </a>
              </>
            ) : (
              <>
                <a
                  href={
                    role === 'ADMIN'
                      ? `${ADMIN_PORTAL_URL}/dashboard`
                      : role === 'VENDOR'
                      ? `${VENDOR_PORTAL_URL}/dashboard`
                      : '/customer/dashboard'
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center bg-burgundy-700 text-white rounded-lg font-medium"
                >
                  Go to {role === 'ADMIN' ? 'Admin Center' : role === 'VENDOR' ? 'Vendor Portal' : 'My Dashboard'}
                </a>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full py-2 text-center text-sm text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
