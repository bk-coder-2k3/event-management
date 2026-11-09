import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@vizhaspace/shared';

export function Footer() {
  const VENDOR_PORTAL_URL = process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3001';
  const ADMIN_PORTAL_URL = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3002';

  return (
    <footer className="bg-burgundy-950 text-ivory-200 border-t-2 border-gold-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-burgundy-950 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-black text-ivory-50 tracking-tight">
                Vizha<span className="text-gold-400">Space</span>
              </span>
            </Link>
            <p className="text-sm text-ivory-300 leading-relaxed max-w-sm">
              Tamil Nadu's premier all-events and wedding vendor marketplace. Discover, compare, and connect with top-rated banquet halls, mandapams, party caterers, photographers, and decorators on vizhaspace.in.
            </p>
            <div className="pt-2 text-xs text-gold-400/90 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Headquartered in Madurai, Tamil Nadu 625001 &bull; vizhaspace.in</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Wedding Categories
            </h4>
            <ul className="space-y-2 text-sm text-ivory-300">
              <li>
                <Link href="/categories/venues" className="hover:text-gold-300 transition">
                  Kalyana Mandapams & Halls
                </Link>
              </li>
              <li>
                <Link href="/categories/photography" className="hover:text-gold-300 transition">
                  Photography & Films
                </Link>
              </li>
              <li>
                <Link href="/categories/catering" className="hover:text-gold-300 transition">
                  Traditional Catering & Feast
                </Link>
              </li>
              <li>
                <Link href="/categories/decoration" className="hover:text-gold-300 transition">
                  Stage & Floral Decoration
                </Link>
              </li>
              <li>
                <Link href="/categories/makeup" className="hover:text-gold-300 transition">
                  Bridal Makeup & Styling
                </Link>
              </li>
              <li>
                <Link href="/categories/entertainment" className="hover:text-gold-300 transition">
                  Nadaswaram & Music
                </Link>
              </li>
            </ul>
          </div>

          {/* Districts Coverage */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              Districts Served
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {TAMIL_NADU_DISTRICTS.slice(0, 10).map((dist) => (
                <Link
                  key={dist}
                  href={`/vendors?district=${encodeURIComponent(dist)}`}
                  className="px-2.5 py-1 bg-burgundy-900/60 border border-burgundy-800 text-ivory-300 hover:text-gold-300 hover:border-gold-500 rounded transition"
                >
                  {dist}
                </Link>
              ))}
            </div>
          </div>

          {/* For Vendors & Support */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-gold-400 mb-4">
              For Vendors & Support
            </h4>
            <ul className="space-y-2 text-sm text-ivory-300">
              <li>
                <a href={`${VENDOR_PORTAL_URL}/register`} className="text-gold-300 font-semibold hover:underline">
                  Join as Event Partner
                </a>
              </li>
              <li>
                <a href={`${VENDOR_PORTAL_URL}/login`} className="hover:text-gold-300 transition">
                  Vendor Partner Login
                </a>
              </li>
              <li>
                <a href={`${ADMIN_PORTAL_URL}/login`} className="text-xs text-ivory-400 hover:text-gold-400 transition">
                  Administrative Center
                </a>
              </li>
              <li className="pt-2">
                <span className="block text-xs text-ivory-400">Need event assistance?</span>
                <span className="font-semibold text-gold-300 text-sm">support@vizhaspace.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-burgundy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-400">
          <p>© 2026 VizhaSpace (vizhaspace.in). All rights reserved. Made with devotion for Tamil celebrations.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span className="hover:text-ivory-200">Privacy Policy</span>
            <span className="hover:text-ivory-200">Terms of Service</span>
            <span className="hover:text-ivory-200">Vendor Verification Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
