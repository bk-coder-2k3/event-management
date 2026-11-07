'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { VendorCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import {
  Filter,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { TAMIL_NADU_DISTRICTS } from '@kalyanaconnect/shared';

function VendorsDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filters state initialized from searchParams
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'relevance');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [categories, setCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ total: number; totalPages: number; page: number }>({
    total: 0,
    totalPages: 1,
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get<any[]>('/categories');
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch vendors whenever query parameters change
  useEffect(() => {
    async function fetchVendors() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (district && district !== 'all') query.set('district', district);
        if (category && category !== 'all') query.set('category', category);
        if (search) query.set('search', search);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (sortBy) query.set('sortBy', sortBy);
        query.set('page', page.toString());
        query.set('limit', '12');

        const res = await api.get<any[]>(`/vendors?${query.toString()}`);
        if (res.success && res.data) {
          setVendors(res.data);
          if (res.meta) {
            setMeta({
              total: res.meta.total || res.data.length,
              totalPages: res.meta.totalPages || 1,
              page: res.meta.page || 1,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, [district, category, search, minPrice, maxPrice, sortBy, page]);

  const handleApplyFilters = () => {
    setPage(1);
    const query = new URLSearchParams();
    if (district) query.set('district', district);
    if (category) query.set('category', category);
    if (search) query.set('search', search);
    if (minPrice) query.set('minPrice', minPrice);
    if (maxPrice) query.set('maxPrice', maxPrice);
    if (sortBy) query.set('sortBy', sortBy);
    router.push(`/vendors?${query.toString()}`);
    setIsMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDistrict('');
    setCategory('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevance');
    setPage(1);
    router.push('/vendors');
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />

      {/* Directory Page Header */}
      <div className="bg-burgundy-950 text-white py-12 border-b border-gold-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase font-bold tracking-widest text-gold-400 block mb-1">
            Tamil Nadu Wedding Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50">
            Wedding Service Providers
          </h1>
          <p className="mt-2 text-sm text-ivory-300">
            Showing verified Kalyana Mandapams, photography teams, decorators, and catering virundhu in{' '}
            <strong className="text-gold-300">{district || 'All Tamil Nadu'}</strong>.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
                <div className="flex items-center gap-2 font-serif font-bold text-burgundy-900 text-base">
                  <SlidersHorizontal className="w-4 h-4 text-gold-600" />
                  <span>Filter Vendors</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-gray-500 hover:text-burgundy-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-2">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <option value="">All Tamil Nadu Districts</option>
                  {TAMIL_NADU_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-2">
                  Service Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-2">
                  Starting Price (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="px-2.5 py-1.5 bg-ivory-100 border border-ivory-300 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="px-2.5 py-1.5 bg-ivory-100 border border-ivory-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <Button variant="primary" onClick={handleApplyFilters} className="w-full text-xs py-2.5">
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Vendors Results Area */}
          <main className="flex-1">
            {/* Control Bar: Search & Sort */}
            <div className="bg-white p-4 rounded-xl border border-ivory-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  placeholder="Search by name, mandapam, etc..."
                  className="w-full pl-9 pr-4 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-ivory-200 text-burgundy-900 rounded-lg text-xs font-bold"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 bg-ivory-100 border border-ivory-300 rounded-lg text-xs font-medium text-gray-800 focus:outline-none cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newly Listed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="text-xs text-gray-500 mb-4 px-1">
              Found <strong>{meta.total}</strong> verified wedding vendors in Tamil Nadu
            </div>

            {/* Vendor Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <VendorCardSkeleton key={i} />
                ))}
              </div>
            ) : vendors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8">
                <MapPin className="w-10 h-10 text-gold-500 mx-auto mb-3" />
                <h3 className="font-serif text-xl font-bold text-burgundy-900 mb-1">
                  No Vendors Matching Your Criteria
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Try broadening your search or resetting filters to explore vendors across Madurai and other districts.
                </p>
                <Button variant="secondary" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </Button>

                {Array.from({ length: meta.totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                        page === pNum
                          ? 'bg-burgundy-700 text-white'
                          : 'bg-white text-gray-700 hover:bg-ivory-200 border border-ivory-300'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-serif font-bold text-burgundy-900">Filter Vendors</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 font-bold">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-burgundy-900 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 bg-ivory-100 border rounded-lg text-sm"
              >
                <option value="">All Districts</option>
                {TAMIL_NADU_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-burgundy-900 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 bg-ivory-100 border rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="primary" onClick={handleApplyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function VendorsDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-gold-400 border-t-burgundy-700 rounded-full animate-spin" />
        </div>
      }
    >
      <VendorsDirectoryContent />
    </Suspense>
  );
}
