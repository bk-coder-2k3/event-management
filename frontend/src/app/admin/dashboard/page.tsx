'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api-client';
import {
  Users,
  Store,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.get<any>('/admin/stats');
        if (res.success && res.data) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = statsData?.stats || {};
  const recentVendors = statsData?.recentVendors || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-black text-gray-900">
          Executive Platform Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor platform metrics, approve wedding vendor listings, and enforce trust & safety.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-gray-500">Pending Review</span>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {stats.pendingVendors || 0}
              </div>
              <span className="text-[11px] text-amber-700 font-medium mt-1 block">Awaiting decision</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-gray-500">Live Vendors</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                {stats.approvedVendors || 0}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Approved & visible</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-burgundy-700">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-gray-500">Total Users</span>
              <div className="text-3xl font-black text-burgundy-900 mt-1">
                {stats.totalUsers || 0}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Customers & Vendors</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-burgundy-50 text-burgundy-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gold-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-gray-500">Pending Reviews</span>
              <div className="text-3xl font-black text-gold-600 mt-1">
                {stats.pendingReviews || 0}
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">Moderation queue</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Vendor Applications Action Center */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Vendor Registrations</CardTitle>
          <Link
            href="/admin/vendors"
            className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentVendors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Business Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentVendors.map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{v.businessName}</span>
                        <span className="text-gray-400 text-[11px]">{v.owner?.email}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{v.category?.name}</td>
                      <td className="py-3 px-4 text-gray-600">{v.city}, {v.district}</td>
                      <td className="py-3 px-4">
                        {v.approvalStatus === 'APPROVED' ? (
                          <Badge variant="success">Approved</Badge>
                        ) : v.approvalStatus === 'REJECTED' ? (
                          <Badge variant="danger">Rejected</Badge>
                        ) : (
                          <Badge variant="warning">Pending Review</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href="/admin/vendors"
                          className="px-3 py-1 bg-burgundy-50 text-burgundy-800 hover:bg-burgundy-100 font-semibold rounded-md transition text-xs"
                        >
                          Review Application
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-xs">
              No recent vendor applications recorded.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
