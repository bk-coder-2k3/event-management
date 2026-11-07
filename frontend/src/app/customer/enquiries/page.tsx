'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, MessageCircle, Calendar, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CustomerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnquiries() {
      try {
        setLoading(true);
        const res = await api.get<any[]>('/enquiries/customer');
        if (res.success && res.data) {
          setEnquiries(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEnquiries();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="warning">Submitted</Badge>;
      case 'CONTACTED':
        return <Badge variant="info">Vendor Contacted</Badge>;
      case 'QUOTED':
        return <Badge variant="gold">Quote Sent</Badge>;
      case 'ACCEPTED':
        return <Badge variant="success">Confirmed & Booked</Badge>;
      case 'DECLINED':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filtered = filterStatus === 'ALL' ? enquiries : enquiries.filter((e) => e.status === filterStatus);

  const openWhatsApp = (vendor: any) => {
    if (!vendor.whatsappPhone) return;
    const cleanNumber = vendor.whatsappPhone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    window.open(`https://wa.me/${fullNumber}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
            My Wedding Enquiries ({enquiries.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Track vendor replies, availability updates, and received quotations.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none"
          >
            <option value="ALL">All Enquiries</option>
            <option value="NEW">Submitted</option>
            <option value="CONTACTED">Vendor Contacted</option>
            <option value="QUOTED">Quoted</option>
            <option value="ACCEPTED">Confirmed</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-ivory-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((enq) => (
            <Card key={enq.id} className="overflow-hidden hover:border-gold-300 transition">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-ivory-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/vendors/${enq.vendor?.slug}`}
                        className="font-serif text-lg font-bold text-burgundy-950 hover:text-burgundy-700"
                      >
                        {enq.vendor?.businessName}
                      </Link>
                      {getStatusBadge(enq.status)}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-burgundy-600" />
                        {enq.eventCity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gold-600" />
                        {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString('en-IN') : 'Flexible Dates'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {enq.vendor?.whatsappPhone && (
                      <button
                        onClick={() => openWhatsApp(enq.vendor)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>
                    )}
                    <Link
                      href={`/vendors/${enq.vendor?.slug}`}
                      className="px-3 py-1.5 bg-ivory-100 text-burgundy-900 border border-ivory-300 rounded-lg text-xs font-semibold hover:bg-ivory-200 flex items-center gap-1 transition"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Budget Indicated</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {enq.budgetMin || enq.budgetMax
                        ? `₹${Number(enq.budgetMin || 0).toLocaleString('en-IN')} - ₹${Number(
                            enq.budgetMax || 0
                          ).toLocaleString('en-IN')}`
                        : 'Not specified'}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Your Requirements</span>
                    <p className="italic text-gray-700 bg-ivory-50 p-2.5 rounded-lg border border-ivory-200 mt-1">
                      "{enq.requirements}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8 space-y-4">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-burgundy-900">No Enquiries Found</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            You don't have any enquiries in this category yet. Find marriage halls and vendors to request quotes.
          </p>
          <Link
            href="/vendors"
            className="inline-block px-6 py-2.5 bg-burgundy-700 text-white rounded-xl text-xs font-bold"
          >
            Find Vendors
          </Link>
        </div>
      )}
    </div>
  );
}
