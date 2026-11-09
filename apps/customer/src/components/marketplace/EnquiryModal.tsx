'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/features/auth/AuthContext';
import { api } from '@/lib/api-client';
import { MessageCircle, CheckCircle, Sparkles, Send } from 'lucide-react';
import { EVENT_TYPES } from '@vizhaspace/shared';

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: {
    id: string;
    businessName: string;
    whatsappPhone?: string | null;
    city: string;
    district: string;
  };
}

export function EnquiryModal({ isOpen, onClose, vendor }: EnquiryModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    eventType: EVENT_TYPES[0] as string,
    eventDate: '',
    eventCity: vendor.city || 'Madurai',
    budgetMin: '',
    budgetMax: '',
    requirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        vendorId: vendor.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        eventType: formData.eventType,
        eventDate: formData.eventDate || null,
        eventCity: formData.eventCity,
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : null,
        requirements: formData.requirements,
      };

      const res = await api.post('/enquiries', payload);
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.error?.message || 'Failed to submit enquiry. Please verify your information.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your enquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!vendor.whatsappPhone) return;
    const cleanNumber = vendor.whatsappPhone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const text = encodeURIComponent(
      `Vanakkam! I found your profile on VizhaSpace (vizhaspace.in) for "${vendor.businessName}". I would like to inquire regarding availability and packages for my upcoming ${formData.eventType || 'event'}.`
    );
    window.open(`https://wa.me/${fullNumber}?text=${text}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSuccess(false);
        setError(null);
        onClose();
      }}
      title={`Enquire with ${vendor.businessName}`}
      description="Connect directly with this service provider on VizhaSpace (vizhaspace.in) for quotes & date availability."
      maxWidth="lg"
    >
      {success ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-xl font-bold text-burgundy-900 mb-2">Enquiry Sent Successfully!</h4>
          <p className="text-sm text-gray-600 mb-6">
            The team at <strong>{vendor.businessName}</strong> has received your event requirements on VizhaSpace and will contact you via phone or email shortly.
          </p>

          {vendor.whatsappPhone && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-6">
              <p className="text-xs text-emerald-800 font-semibold mb-2">Need a faster response?</p>
              <Button
                variant="primary"
                onClick={handleWhatsAppClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp Now
              </Button>
            </div>
          )}

          <Button
            variant="secondary"
            onClick={() => {
              setSuccess(false);
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Senthil Nathan"
            />
            <Input
              label="Phone Number"
              required
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="e.g. 9842100000"
              helperText="10-digit Indian mobile number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="senthil@example.com"
            />
            <Input
              label="Event City"
              required
              value={formData.eventCity}
              onChange={(e) => setFormData({ ...formData, eventCity: e.target.value })}
              placeholder="e.g. Madurai"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
              Event Celebration Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Wedding / Event Date"
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
            <Input
              label="Budget Min (₹)"
              type="number"
              value={formData.budgetMin}
              onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
              placeholder="e.g. 50000"
            />
            <Input
              label="Budget Max (₹)"
              type="number"
              value={formData.budgetMax}
              onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
              placeholder="e.g. 150000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy-900 mb-1.5">
              Wedding Requirements / Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Please describe your event requirements (e.g., number of guests, Muhurtham timing, special arrangements)..."
              className="w-full px-3.5 py-2.5 bg-white border border-ivory-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-500"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button type="submit" isLoading={loading} variant="primary" className="w-full sm:flex-1">
              <Send className="w-4 h-4 mr-2" />
              Submit Official Enquiry
            </Button>

            {vendor.whatsappPhone && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleWhatsAppClick}
                className="w-full sm:w-auto text-emerald-800 border-emerald-300 hover:bg-emerald-50"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
                WhatsApp
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
