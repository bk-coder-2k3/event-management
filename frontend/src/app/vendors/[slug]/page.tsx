'use client';

import React, { useEffect, useState, use } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { api } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';
import {
  MapPin,
  ShieldCheck,
  Heart,
  Phone,
  MessageCircle,
  Package,
  Calendar,
  Check,
  Sparkles,
  ChevronRight,
  Share2,
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { user } = useAuth();

  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await api.get<any>(`/vendors/${slug}`);
      if (res.success && res.data) {
        setVendor(res.data);
      } else {
        setError(res.error?.message || 'Vendor not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full animate-pulse space-y-8">
          <div className="h-80 bg-ivory-300 rounded-3xl" />
          <div className="h-10 w-1/3 bg-ivory-300 rounded" />
          <div className="h-40 bg-ivory-300 rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-ivory-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-red-100 text-burgundy-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-burgundy-900 mb-2">Vendor Listing Unavailable</h2>
          <p className="text-sm text-gray-600 mb-6">{error || 'The requested vendor profile is not accessible.'}</p>
          <Link
            href="/vendors"
            className="px-6 py-2.5 bg-burgundy-700 text-white rounded-lg text-sm font-semibold hover:bg-burgundy-800 transition"
          >
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const fallbackImage =
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
  const images = vendor.images && vendor.images.length > 0 ? vendor.images : [{ imageUrl: fallbackImage }];
  const currentImage = images[activeImageIndex]?.imageUrl || fallbackImage;

  const formattedStartingPrice =
    vendor.startingPrice !== null && vendor.startingPrice !== undefined
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
          Number(vendor.startingPrice)
        )
      : null;

  const handleWhatsAppClick = () => {
    if (!vendor.whatsappPhone) return;
    const cleanNumber = vendor.whatsappPhone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const text = encodeURIComponent(
      `Vanakkam! I saw your profile on KalyanaConnect for "${vendor.businessName}". I would like to enquire about wedding packages.`
    );
    window.open(`https://wa.me/${fullNumber}?text=${text}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vendor.businessName} | KalyanaConnect`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Vendor link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-ivory-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-burgundy-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/vendors" className="hover:text-burgundy-700">Vendors</Link>
          {vendor.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <Link href={`/categories/${vendor.category.slug}`} className="hover:text-burgundy-700">
                {vendor.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-burgundy-900 font-semibold truncate max-w-xs">{vendor.businessName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-10">
        {/* Hero Section: Gallery & Quick Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Gallery View (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-80 sm:h-96 md:h-[460px] w-full rounded-3xl overflow-hidden bg-ivory-300 shadow-md border border-ivory-200">
              <img
                src={currentImage}
                alt={vendor.businessName}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {vendor.verificationStatus === 'VERIFIED' && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-lg">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Provider
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-gold-500 scale-105 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Meta Box (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-ivory-200 shadow-sm space-y-6">
            <div>
              {vendor.category && (
                <span className="inline-block px-3 py-1 bg-gold-100 text-gold-900 font-bold text-xs uppercase tracking-wider rounded-md mb-2">
                  {vendor.category.name}
                </span>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950 leading-tight">
                {vendor.businessName}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-burgundy-700 shrink-0" />
                <span>{vendor.address}, {vendor.city}, {vendor.district} - {vendor.postalCode}</span>
              </div>
            </div>

            {/* Rating summary */}
            <div className="p-4 bg-ivory-50 rounded-2xl border border-ivory-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Customer Rating</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-black text-burgundy-900">{vendor.avgRating || '5.0'}</span>
                  <StarRating rating={vendor.avgRating || 5} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Verified Reviews</span>
                <span className="text-sm font-bold text-gray-800">{vendor.reviewCount || 0} Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            {formattedStartingPrice && (
              <div className="border-t border-ivory-200 pt-4">
                <span className="text-xs text-gray-500 block uppercase font-semibold">Starting Price</span>
                <div className="text-2xl font-black text-gold-600 mt-0.5">{formattedStartingPrice}</div>
                <span className="text-[11px] text-gray-400">*Varies depending on guest count and package customization</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                variant="primary"
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 shadow-wedding"
              >
                <Calendar className="w-5 h-5 text-gold-400" />
                <span>Check Availability & Get Quote</span>
              </Button>

              {vendor.whatsappPhone && (
                <Button
                  variant="secondary"
                  onClick={handleWhatsAppClick}
                  className="w-full py-3 border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                  <span>Chat with Vendor on WhatsApp</span>
                </Button>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleShare}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 hover:text-burgundy-700 bg-ivory-100 hover:bg-ivory-200 rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <section className="bg-white p-8 rounded-3xl border border-ivory-200 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-burgundy-950">About {vendor.businessName}</h2>
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {vendor.description}
          </div>
        </section>

        {/* Service Packages */}
        {vendor.packages && vendor.packages.length > 0 && (
          <section className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
                Curated Offerings
              </span>
              <h2 className="font-serif text-2xl font-bold text-burgundy-950">
                Service Packages & Inclusions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendor.packages.map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="bg-white p-6 rounded-2xl border border-ivory-200 shadow-sm hover:border-gold-400 hover:shadow-wedding transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-lg font-bold text-burgundy-950 mb-1">{pkg.name}</h3>
                    <div className="text-2xl font-black text-gold-600 my-2">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-gray-600 mb-4">{pkg.description}</p>

                    {/* Inclusions */}
                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <div className="space-y-2 border-t border-ivory-100 pt-3">
                        <span className="text-[11px] font-bold text-burgundy-900 uppercase tracking-wider block">
                          Included In Package:
                        </span>
                        <ul className="space-y-1.5 text-xs text-gray-700">
                          {pkg.inclusions.map((inc: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-ivory-100">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsEnquiryOpen(true)}
                      className="w-full text-xs font-semibold"
                    >
                      Enquire for this Package
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews & Form */}
        <section className="bg-white p-8 rounded-3xl border border-ivory-200 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
              Real Experiences
            </span>
            <h2 className="font-serif text-2xl font-bold text-burgundy-950">
              Verified Customer Reviews ({vendor.reviews?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {vendor.reviews && vendor.reviews.length > 0 ? (
                vendor.reviews.map((rev: any) => (
                  <div key={rev.id} className="p-5 bg-ivory-50 rounded-2xl border border-ivory-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-burgundy-950 text-sm">
                        {rev.customer?.fullName || 'Verified Customer'}
                      </span>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-gray-400 block">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-ivory-50 rounded-xl text-center text-xs text-gray-500">
                  No public reviews yet for this vendor. Be the first to review!
                </div>
              )}
            </div>

            {/* Review Form */}
            <div className="lg:col-span-5">
              <ReviewForm
                vendorId={vendor.id}
                vendorName={vendor.businessName}
                onReviewSubmitted={fetchVendor}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        vendor={{
          id: vendor.id,
          businessName: vendor.businessName,
          whatsappPhone: vendor.whatsappPhone,
          city: vendor.city,
          district: vendor.district,
        }}
      />

      <Footer />
    </div>
  );
}
