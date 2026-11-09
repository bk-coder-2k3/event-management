'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { VendorCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import {
  Sparkles,
  Search,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  BadgeCheck,
  ArrowRight,
  Camera,
  Building2,
  UtensilsCrossed,
  Palette,
  Crown,
  Music,
  CalendarHeart,
  Mail,
} from 'lucide-react';
import { INITIAL_CATEGORIES, TAMIL_NADU_DISTRICTS, EVENT_TYPES } from '@vizhaspace/shared';

const categoryIcons: Record<string, any> = {
  venues: Building2,
  photography: Camera,
  decoration: Sparkles,
  catering: UtensilsCrossed,
  makeup: Palette,
  'bridal-wear': Crown,
  entertainment: Music,
  'wedding-planners': CalendarHeart,
  invitations: Mail,
};

export default function HomePage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('Madurai');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFeaturedVendors() {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/vendors?limit=6');
        if (res.success && res.data) {
          setVendors(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedVendors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    window.location.href = `/vendors?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />

      {/* Hero Section with authentic South Indian celebration vibe */}
      <section className="relative overflow-hidden bg-burgundy-950 text-white py-20 lg:py-28">
        {/* Decorative Background Floral Gradients */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-gold-600/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-burgundy-700/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-900/80 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Tamil Nadu's All-Event & Celebration Services Marketplace
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-ivory-50 tracking-tight leading-tight max-w-4xl mx-auto">
            Find Your Perfect <span className="text-gold-400 italic">Event & Wedding Team</span> in Tamil Nadu
          </h1>

          <p className="mt-5 text-base sm:text-lg text-ivory-200/90 max-w-2xl mx-auto font-light leading-relaxed">
            Connect directly with verified Banquet Halls, Mandapams, Caterers, Photographers, and Decorators for Weddings, Birthdays, Corporate Gatherings & Special Celebrations.
          </p>

          {/* Event Quick Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {['All Celebrations', 'Weddings', 'Birthday Parties', 'Corporate Meets', 'Baby Showers', 'Housewarming'].map((evt) => {
              const isActive = (evt === 'All Celebrations' && !selectedEventType) || selectedEventType === evt;
              return (
                <button
                  key={evt}
                  type="button"
                  onClick={() => {
                    if (evt === 'All Celebrations') {
                      setSelectedEventType('');
                    } else {
                      setSelectedEventType(evt);
                      setSearchQuery(evt);
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition duration-200 border ${
                    isActive
                      ? 'bg-gold-500 text-burgundy-950 border-gold-400 shadow-md'
                      : 'bg-burgundy-900/70 text-ivory-200 border-gold-500/30 hover:bg-burgundy-800 hover:text-white'
                  }`}
                >
                  {evt}
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <div className="mt-6 max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-gold-500/30 text-gray-800">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* District */}
              <div className="sm:col-span-3 flex items-center gap-2 px-3 py-2.5 bg-ivory-100 rounded-xl border border-ivory-300">
                <MapPin className="w-4 h-4 text-burgundy-700 shrink-0" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-800 w-full focus:outline-none cursor-pointer"
                >
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2.5 bg-ivory-100 rounded-xl border border-ivory-300">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-800 w-full focus:outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {INITIAL_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword / Name */}
              <div className="sm:col-span-3 px-3 py-2.5 bg-ivory-100 rounded-xl border border-ivory-300">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hall name, caterer..."
                  className="bg-transparent text-sm text-gray-800 w-full focus:outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Submit */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick stats counter */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto pt-6 border-t border-burgundy-900/80 text-ivory-200">
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">100%</span>
              <span className="text-xs text-ivory-400 uppercase tracking-wider">Admin Verified</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">Madurai</span>
              <span className="text-xs text-ivory-400 uppercase tracking-wider">& Surrounding Hubs</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">₹0</span>
              <span className="text-xs text-ivory-400 uppercase tracking-wider">Booking Commission</span>
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">Direct</span>
              <span className="text-xs text-ivory-400 uppercase tracking-wider">WhatsApp Connect</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
              Curated Event Services
            </span>
            <h2 className="font-serif text-3xl font-black text-burgundy-950">
              Browse by Event Category
            </h2>
          </div>
          <Link
            href="/vendors"
            className="mt-4 md:mt-0 text-sm font-semibold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Sparkles;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group p-5 bg-white rounded-2xl border border-ivory-200 hover:border-gold-400 hover:shadow-wedding transition duration-300 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-ivory-100 group-hover:bg-gold-50 text-burgundy-700 group-hover:text-gold-600 flex items-center justify-center mb-3 transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-sm text-burgundy-950 group-hover:text-burgundy-700 mb-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Vendors in Madurai */}
      <section className="py-16 bg-white border-y border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
                Verified Partners in Madurai
              </span>
              <h2 className="font-serif text-3xl font-black text-burgundy-950">
                Featured Wedding Professionals
              </h2>
            </div>
            <Link
              href="/vendors?district=Madurai"
              className="mt-4 md:mt-0 px-4 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs font-bold uppercase tracking-wider text-burgundy-900 hover:bg-gold-500 hover:text-burgundy-950 transition"
            >
              See All Madurai Vendors
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <VendorCardSkeleton key={i} />
              ))}
            </div>
          ) : vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-ivory-50 rounded-2xl border border-ivory-200">
              <Sparkles className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <h3 className="font-serif text-lg font-bold text-burgundy-900 mb-1">Connecting Madurai Vendors</h3>
              <p className="text-sm text-gray-600 mb-4">Vendors are currently onboarding. Be the first to register!</p>
              <a
                href={`${process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3001'}/register`}
                className="inline-block px-5 py-2.5 bg-burgundy-700 text-white rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition"
              >
                Register Your Wedding Business
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Why VizhaSpace Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
            Built for Every Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-burgundy-950">
            Why Organizers Choose VizhaSpace
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Planning any grand event across Tamil Nadu requires trusted venues, punctual caterers, top photographers, and decor specialists. VizhaSpace (vizhaspace.in) makes vendor discovery reliable and seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm hover:shadow-wedding transition">
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-2">100% Administrative Verification</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every vendor profile is manually screened by our administration team. No fabricated ratings, unverified claims, or phantom listings.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm hover:shadow-wedding transition">
            <div className="w-12 h-12 rounded-xl bg-burgundy-100 text-burgundy-700 flex items-center justify-center mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-2">Direct Negotiation & WhatsApp</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We never conceal contact details behind high commission walls. Communicate directly with event managers via phone, enquiry inbox, and WhatsApp.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-ivory-200 shadow-sm hover:shadow-wedding transition">
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-5">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-2">Localized Tamil Nadu Expertise</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              From traditional mandapams and luxury banquet halls to authentic catering feasts and modern corporate setups, we cover all event traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Vendor Call to Action */}
      <section className="bg-burgundy-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-burgundy-950 rounded-full text-gold-400 text-xs uppercase font-bold tracking-wider">
            For Event Service Providers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50">
            Are You an Event Vendor in Tamil Nadu?
          </h2>
          <p className="text-sm sm:text-base text-ivory-200 max-w-2xl mx-auto">
            Join VizhaSpace (vizhaspace.in) to showcase your packages, receive verified customer enquiries, and grow your event bookings in Chennai, Coimbatore, Madurai, Trichy, and across Tamil Nadu.
          </p>
          <div className="pt-2">
            <a
              href={`${process.env.NEXT_PUBLIC_VENDOR_PORTAL_URL || 'http://localhost:3001'}/register`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold rounded-xl text-sm shadow-xl transition"
            >
              <span>Register Your Event Business Today</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
