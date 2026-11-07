'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api-client';
import { Store, ShieldCheck, Check, X, Eye, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Decision Modal State
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'UNVERIFIED' | 'VERIFIED'>('VERIFIED');
  const [actionLoading, setActionLoading] = useState(false);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const query = filterStatus !== 'ALL' ? `?approvalStatus=${filterStatus}` : '';
      const res = await api.get<any[]>(`/admin/vendors${query}`);
      if (res.success && res.data) {
        setVendors(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [filterStatus]);

  const handleOpenDecision = (vendor: any, type: 'APPROVED' | 'REJECTED') => {
    setSelectedVendor(vendor);
    setDecisionType(type);
    setRejectionReason('');
    setVerificationStatus(vendor.verificationStatus || 'VERIFIED');
    setIsDecisionModalOpen(true);
  };

  const handleExecuteDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    if (decisionType === 'REJECTED' && rejectionReason.trim().length < 5) {
      alert('Please provide a meaningful rejection reason of at least 5 characters.');
      return;
    }

    setActionLoading(true);
    try {
      const payload: any = {
        status: decisionType,
        rejectionReason: decisionType === 'REJECTED' ? rejectionReason : undefined,
        verificationStatus: decisionType === 'APPROVED' ? verificationStatus : undefined,
      };

      const res = await api.patch(`/admin/vendors/${selectedVendor.id}/decision`, payload);
      if (res.success) {
        setIsDecisionModalOpen(false);
        await loadVendors();
      } else {
        alert(res.error?.message || 'Failed to update vendor status');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVerification = async (vendor: any) => {
    const nextStatus = vendor.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    try {
      const res = await api.patch(`/admin/vendors/${vendor.id}/verify`, {
        verificationStatus: nextStatus,
      });
      if (res.success) {
        setVendors(
          vendors.map((v) => (v.id === vendor.id ? { ...v, verificationStatus: nextStatus } : v))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-gray-900">
            Vendor Applications & Directory Management ({vendors.length})
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review submitted profiles, verify trade authenticity, and manage public visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved & Live</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : vendors.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b">
                  <tr>
                    <th className="py-3 px-4">Business Profile</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">District & City</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-4 px-4">
                        <span className="font-bold text-gray-900 text-sm block">{v.businessName}</span>
                        <span className="text-gray-500 text-[11px] block">Owner: {v.owner?.fullName} ({v.owner?.email})</span>
                        {v.slug && (
                          <Link
                            href={`/vendors/${v.slug}`}
                            target="_blank"
                            className="text-burgundy-700 hover:underline flex items-center gap-1 mt-1 text-[11px]"
                          >
                            <span>Public Slug: /{v.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-700">{v.category?.name}</td>
                      <td className="py-4 px-4 text-gray-600">{v.city}, {v.district}</td>
                      <td className="py-4 px-4">
                        {v.approvalStatus === 'APPROVED' ? (
                          <Badge variant="success">Approved</Badge>
                        ) : v.approvalStatus === 'REJECTED' ? (
                          <Badge variant="danger">Rejected</Badge>
                        ) : (
                          <Badge variant="warning">Pending Review</Badge>
                        )}
                        {v.rejectionReason && (
                          <span className="text-[10px] text-red-600 block mt-1 italic">
                            Reason: {v.rejectionReason}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleVerification(v)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                            v.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                          title="Click to toggle verified status"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{v.verificationStatus}</span>
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {v.approvalStatus !== 'APPROVED' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenDecision(v, 'APPROVED')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-xs py-1"
                          >
                            Approve
                          </Button>
                        )}
                        {v.approvalStatus !== 'REJECTED' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleOpenDecision(v, 'REJECTED')}
                            className="text-xs py-1"
                          >
                            Reject
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border p-8 text-gray-500 text-sm">
          No vendor records found for this filter.
        </div>
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        title={
          decisionType === 'APPROVED'
            ? `Approve Listing: ${selectedVendor?.businessName}`
            : `Reject Listing: ${selectedVendor?.businessName}`
        }
        description={
          decisionType === 'APPROVED'
            ? 'This vendor will become immediately searchable in public marketplace results.'
            : 'Explain the deficiencies so the vendor can rectify and resubmit.'
        }
      >
        <form onSubmit={handleExecuteDecision} className="space-y-4">
          {decisionType === 'APPROVED' ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase text-gray-700">
                Assign Verification Badge
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as any)}
                className="w-full p-2 bg-gray-50 border rounded-lg text-sm"
              >
                <option value="VERIFIED">VERIFIED (Show Verified Badge)</option>
                <option value="UNVERIFIED">UNVERIFIED (Standard Listing)</option>
              </select>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-red-700">
                Rejection Reason (Sent to Vendor) <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete pricing details or invalid contact telephone..."
                className="w-full p-2.5 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsDecisionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={decisionType === 'APPROVED' ? 'primary' : 'danger'}
              isLoading={actionLoading}
              className={decisionType === 'APPROVED' ? 'bg-emerald-700 hover:bg-emerald-800' : ''}
            >
              Confirm {decisionType === 'APPROVED' ? 'Approval' : 'Rejection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
