'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import {
  Building,
  Package,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const [vendorData, setVendorData] = useState<any | null>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const CUSTOMER_PORTAL_URL = process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [vRes, eRes] = await Promise.all([
          api.get<any>('/vendors/me'),
          api.get<any[]>('/enquiries/vendor'),
        ]);

        if (vRes.success && vRes.data) {
          setVendorData(vRes.data);
        }
        if (eRes.success && eRes.data) {
          setEnquiries(eRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-ivory-300 rounded-3xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-ivory-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // If vendor hasn't completed profile yet
  if (!vendorData) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-ivory-200 p-8 space-y-4">
        <Building className="w-12 h-12 text-gold-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-burgundy-900">Complete Your Vendor Onboarding</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          You haven't registered your wedding business profile yet. Finish your listing to begin receiving enquiries.
        </p>
        <Link
          href="/onboarding"
          className="inline-block px-6 py-2.5 bg-burgundy-700 text-white rounded-xl text-sm font-bold shadow-md"
        >
          Complete Business Profile
        </Link>
      </div>
    );
  }

  const approvalStatus = vendorData.approvalStatus;

  return (
    <div className="space-y-8">
      {/* Approval Status Alert Banner */}
      {approvalStatus === 'APPROVED' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">Your Wedding Profile is Active & Live</h3>
              <p className="text-xs text-emerald-800">
                Couples across Tamil Nadu can now discover your services and submit booking enquiries.
              </p>
            </div>
          </div>
          <a
            href={`${CUSTOMER_PORTAL_URL}/vendors/${vendorData.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shrink-0 transition"
          >
            <span>Preview Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {approvalStatus === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-950 text-sm">Listing Under Review by VizhaSpace Admin</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Our team is currently verifying your business credentials and pricing details. You can continue uploading gallery photos and service packages while review is in progress.
            </p>
          </div>
        </div>
      )}

      {approvalStatus === 'REJECTED' && (
        <div className="bg-red-50 border border-red-300 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold text-red-950 text-sm">Listing Application Needs Revision</h3>
            <p className="text-xs text-red-800">
              <strong>Administrative Reason:</strong> {vendorData.rejectionReason || 'Please review and update your business documentation.'}
            </p>
            <Link
              href="/profile"
              className="inline-block px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold"
            >
              Update Business Profile
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-burgundy-50 text-burgundy-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Enquiries</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">{enquiries.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Packages</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">
                {vendorData.packages?.length || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ivory-200 text-burgundy-900 flex items-center justify-center">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Photos</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">
                {vendorData.images?.length || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Badge</span>
              <div className="text-sm font-bold text-gray-900 mt-1">
                {vendorData.verificationStatus === 'VERIFIED' ? (
                  <span className="text-emerald-700">Verified Partner</span>
                ) : (
                  <span className="text-gray-500">Standard</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/packages"
          className="p-6 bg-white rounded-2xl border border-ivory-200 hover:border-gold-400 hover:shadow-wedding transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-serif font-bold text-base text-burgundy-900 group-hover:text-burgundy-700">
              Manage Packages
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Add pricing tiers & inclusions</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/gallery"
          className="p-6 bg-white rounded-2xl border border-ivory-200 hover:border-gold-400 hover:shadow-wedding transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-serif font-bold text-base text-burgundy-900 group-hover:text-burgundy-700">
              Upload Gallery
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Showcase high-res event photos</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/profile"
          className="p-6 bg-white rounded-2xl border border-ivory-200 hover:border-gold-400 hover:shadow-wedding transition flex items-center justify-between group"
        >
          <div>
            <h3 className="font-serif font-bold text-base text-burgundy-900 group-hover:text-burgundy-700">
              Business Profile
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Update address, WhatsApp, phone</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gold-600 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent Enquiries Received */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Customer Enquiries</CardTitle>
          <Link
            href="/enquiries"
            className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
          >
            <span>View All Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {enquiries.length > 0 ? (
            <div className="divide-y divide-ivory-200">
              {enquiries.slice(0, 5).map((enq) => (
                <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-burgundy-950 text-sm">
                        {enq.customerName}
                      </span>
                      <Badge variant="info">{enq.status}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      City: {enq.eventCity} &bull; Event Date:{' '}
                      {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString('en-IN') : 'Flexible'} &bull; Phone:{' '}
                      <strong>{enq.customerPhone}</strong>
                    </div>
                    <p className="text-xs text-gray-700 italic line-clamp-1">"{enq.requirements}"</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <a
                      href={`tel:${enq.customerPhone}`}
                      className="px-3 py-1.5 bg-ivory-100 text-burgundy-900 font-semibold rounded-lg text-xs hover:bg-ivory-200 transition"
                    >
                      Call Customer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm">
              No customer enquiries received yet. Keep your portfolio and pricing up-to-date!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
