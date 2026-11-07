'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api-client';
import { MessageSquare, Phone, MessageCircle, Calendar, MapPin, CheckCircle } from 'lucide-react';

export default function VendorEnquiriesInboxPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>('/enquiries/vendor');
      if (res.success && res.data) {
        setEnquiries(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/enquiries/${enquiryId}/status`, { status: newStatus });
      if (res.success) {
        setEnquiries(
          enquiries.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const openWhatsApp = (phone: string, customerName: string) => {
    const cleanNumber = phone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const text = encodeURIComponent(
      `Vanakkam ${customerName}! Thank you for your enquiry on KalyanaConnect. We would love to discuss your wedding plans.`
    );
    window.open(`https://wa.me/${fullNumber}?text=${text}`, '_blank');
  };

  const filtered = filterStatus === 'ALL' ? enquiries : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
            Customer Enquiries Inbox ({enquiries.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Respond promptly to couples inquiring about wedding dates and quotes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-ivory-300 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="ALL">All Enquiries</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
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
            <Card key={enq.id} className="hover:border-gold-300 transition">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ivory-100">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-burgundy-950">
                      {enq.customerName}
                    </h3>
                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-burgundy-600" />
                        {enq.customerPhone}
                      </span>
                      <span>&bull;</span>
                      <span>{enq.customerEmail}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold-600" />
                        {enq.eventCity}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-burgundy-600" />
                        {enq.eventDate ? new Date(enq.eventDate).toLocaleDateString('en-IN') : 'Dates flexible'}
                      </span>
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-ivory-300 bg-ivory-50 text-burgundy-900 focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUOTED">QUOTED</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="DECLINED">DECLINED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {/* Requirements note & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Client Budget</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {enq.budgetMin || enq.budgetMax
                        ? `₹${Number(enq.budgetMin || 0).toLocaleString('en-IN')} - ₹${Number(
                            enq.budgetMax || 0
                          ).toLocaleString('en-IN')}`
                        : 'Not specified'}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-gray-400 block uppercase font-bold text-[10px]">Client Requirements</span>
                    <p className="p-3 bg-ivory-50 rounded-lg border border-ivory-200 text-gray-700 italic mt-1">
                      "{enq.requirements}"
                    </p>
                  </div>
                </div>

                {/* Direct Action buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => openWhatsApp(enq.customerPhone, enq.customerName)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply on WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${enq.customerPhone}`}
                    className="px-4 py-2 bg-ivory-200 hover:bg-ivory-300 text-burgundy-900 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-ivory-200 p-8 space-y-4">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-burgundy-900">Inbox is Clear</h3>
          <p className="text-sm text-gray-600 max-w-sm mx-auto">
            You don't have any customer enquiries under this status filter.
          </p>
        </div>
      )}
    </div>
  );
}
