'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { api } from '@/lib/api-client';
import { Store, ShieldCheck, Check, X, Eye, ExternalLink, AlertTriangle, Layers, MapPin, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { CATEGORY_SPECIFICATIONS } from '@vizhaspace/shared';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const CUSTOMER_PORTAL_URL = process.env.NEXT_PUBLIC_CUSTOMER_PORTAL_URL || 'http://localhost:3000';

  // Decision Modal State
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [inspectVendor, setInspectVendor] = useState<any | null>(null);
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
                          <a
                            href={`${CUSTOMER_PORTAL_URL}/vendors/${v.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-burgundy-700 hover:underline flex items-center gap-1 mt-1 text-[11px]"
                          >
                            <span>Public Slug: /{v.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInspectVendor(v)}
                          className="text-xs py-1 text-gray-600 hover:text-burgundy-800"
                          title="Inspect Specifications & Details"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Inspect
                        </Button>
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

      {/* Inspection Modal */}
      <Modal
        isOpen={Boolean(inspectVendor)}
        onClose={() => setInspectVendor(null)}
        title={`Vendor Inspection: ${inspectVendor?.businessName || ''}`}
        description={`Category: ${inspectVendor?.category?.name || 'Unassigned'} • District: ${inspectVendor?.district || ''}`}
      >
        {inspectVendor && (
          <div className="space-y-5 text-sm">
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase block">Starting Price</span>
                <span className="text-base font-bold text-gray-900">
                  {inspectVendor.startingPrice ? `₹${Number(inspectVendor.startingPrice).toLocaleString('en-IN')}` : 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 uppercase block">Contact / WhatsApp</span>
                <span className="text-xs font-medium text-gray-800">
                  {inspectVendor.whatsappPhone || inspectVendor.phone || 'None'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[11px] font-semibold text-gray-500 uppercase block">Address</span>
                <span className="text-xs text-gray-700">
                  {inspectVendor.address}, {inspectVendor.city}, {inspectVendor.district} - {inspectVendor.postalCode}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                Business Description
              </span>
              <p className="text-xs text-gray-600 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-line max-h-36 overflow-y-auto">
                {inspectVendor.description}
              </p>
            </div>

            {/* Dynamic Category Specifications & Amenities */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-burgundy-900 block mb-2">
                Category-Specific Specifications ({inspectVendor.category?.name})
              </span>
              {inspectVendor.attributes && Object.keys(inspectVendor.attributes).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {(() => {
                    const slug = inspectVendor.category?.slug;
                    const defs = slug ? CATEGORY_SPECIFICATIONS[slug] || [] : [];
                    const defMap = new Map(defs.map((d) => [d.key, d]));

                    return Object.entries(inspectVendor.attributes).map(([key, value]) => {
                      const def = defMap.get(key);
                      const label = def?.label || key;
                      const unit = def?.unit ? ` ${def.unit}` : '';
                      const displayVal = Array.isArray(value)
                        ? value.join(', ')
                        : typeof value === 'boolean'
                        ? value
                          ? 'Yes'
                          : 'No'
                        : String(value) + unit;

                      return (
                        <div key={key} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="text-[11px] text-gray-500 font-semibold block uppercase">
                            {label}
                          </span>
                          <span className="text-xs font-bold text-gray-800 break-words">
                            {displayVal}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              ) : (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                  No category-specific specifications have been submitted yet.
                </div>
              )}
            </div>

            {/* Actions from within inspector */}
            <div className="pt-4 border-t flex justify-between items-center">
              <a
                href={`${CUSTOMER_PORTAL_URL}/vendors/${inspectVendor.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview Public Page
              </a>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInspectVendor(null)}
                >
                  Close
                </Button>
                {inspectVendor.approvalStatus !== 'APPROVED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const target = inspectVendor;
                      setInspectVendor(null);
                      handleOpenDecision(target, 'APPROVED');
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-xs"
                  >
                    Approve
                  </Button>
                )}
                {inspectVendor.approvalStatus !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      const target = inspectVendor;
                      setInspectVendor(null);
                      handleOpenDecision(target, 'REJECTED');
                    }}
                    className="text-xs"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

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
