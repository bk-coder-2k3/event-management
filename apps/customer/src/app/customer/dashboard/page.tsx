'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api-client';
import {
  Heart,
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        setLoading(true);
        const [enqRes, savedRes] = await Promise.all([
          api.get<any[]>('/enquiries/customer'),
          api.get<any[]>('/users/saved-vendors'),
        ]);

        if (enqRes.success && enqRes.data) {
          setEnquiries(enqRes.data);
        }
        if (savedRes.success && savedRes.data) {
          setSavedCount(savedRes.data.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomerData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">Submitted</Badge>;
      case 'CONTACTED':
        return <Badge variant="info">Vendor Contacted</Badge>;
      case 'QUOTED':
        return <Badge variant="gold">Quote Received</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Booked & Confirmed</Badge>;
      case 'DECLINED':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-burgundy-900 to-burgundy-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-wedding">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy-800 rounded-full text-gold-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Tamil Wedding Planning Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-ivory-50">
            Vanakkam, {user?.fullName}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-ivory-200 leading-relaxed">
            Track vendor quotes, monitor wedding hall dates, and keep your wedding dream team organized in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/vendors"
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-burgundy-950 font-bold rounded-xl text-xs flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              <span>Explore More Vendors</span>
            </Link>
            <Link
              href="/customer/saved-vendors"
              className="px-5 py-2.5 bg-burgundy-800/80 hover:bg-burgundy-800 text-white font-medium rounded-xl text-xs border border-gold-500/30 flex items-center gap-2 transition"
            >
              <Heart className="w-4 h-4 text-gold-400" />
              <span>View Saved Vendors ({savedCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-burgundy-50 text-burgundy-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Total Enquiries</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">{enquiries.length}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Saved Vendors</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">{savedCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Bookings Confirmed</span>
              <div className="text-2xl font-black text-burgundy-950 mt-0.5">
                {enquiries.filter((e) => e.status === 'ACCEPTED').length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enquiries Tracker */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Wedding Enquiries</CardTitle>
          <Link
            href="/customer/enquiries"
            className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-ivory-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : enquiries.length > 0 ? (
            <div className="divide-y divide-ivory-200">
              {enquiries.slice(0, 5).map((enq) => (
                <div key={enq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/vendors/${enq.vendor?.slug}`}
                        className="font-serif font-bold text-burgundy-950 hover:text-burgundy-700 text-base"
                      >
                        {enq.vendor?.businessName}
                      </Link>
                      {getStatusBadge(enq.status)}
                    </div>
                    <div className="text-xs text-gray-500">
                      City: <strong>{enq.eventCity}</strong> &bull; Date:{' '}
                      {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString('en-IN') : 'Dates flexible'}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1 italic">"{enq.requirements}"</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/vendors/${enq.vendor?.slug}`}
                      className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 text-burgundy-900 font-semibold rounded-lg text-xs flex items-center gap-1 border border-ivory-300"
                    >
                      <span>Vendor Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-sm space-y-3">
              <MessageSquare className="w-8 h-8 text-gray-400 mx-auto" />
              <p>You haven't submitted any enquiries yet.</p>
              <Link
                href="/vendors"
                className="inline-block px-4 py-2 bg-burgundy-700 text-white rounded-lg text-xs font-semibold"
              >
                Find Vendors Now
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
