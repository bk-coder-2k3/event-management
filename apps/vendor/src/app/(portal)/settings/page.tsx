'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/features/auth/AuthContext';
import { Settings, Shield, Bell, HelpCircle } from 'lucide-react';

export default function VendorSettingsPage() {
  const { user } = useAuth();
  const vendor = user?.vendorProfile;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950">
          Account & Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Manage notifications, security status, and support preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Account Credentials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-gray-700">
          <div className="flex justify-between py-2 border-b border-ivory-100">
            <span className="text-gray-500">Registered Email</span>
            <span className="font-semibold text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-ivory-100">
            <span className="text-gray-500">Business Public URL Identifier (Slug)</span>
            <span className="font-mono text-burgundy-900 font-semibold">{vendor?.slug || 'Not generated'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-ivory-100">
            <span className="text-gray-500">Administrative Verification Status</span>
            <span className="font-bold text-gold-700">{vendor?.verificationStatus || 'UNVERIFIED'}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Need Support or Verification Assistance?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-gray-600">
          <p>
            If you need help updating your trade license, GSTIN, or want to schedule an in-person venue inspection, contact our vendor partnerships desk.
          </p>
          <div className="p-4 bg-ivory-100 rounded-xl border border-ivory-200 text-burgundy-950">
            <span className="block font-bold">VizhaSpace Vendor Desk (vizhaspace.in)</span>
            <span className="block text-gray-600 mt-0.5">Email: vendors@vizhaspace.in</span>
            <span className="block text-gray-600">Helpline: +91 98420 12345 (9:00 AM - 6:00 PM IST)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
