import { Request } from 'express';
import { prisma } from '../../config/db';
import { APPROVAL_STATUSES, VERIFICATION_STATUSES } from '@vizhaspace/shared';
import { NotFoundError } from '../../utils/errors';
import { AuditService } from '../../services/auditService';

export class AdminService {
  /**
   * Platform statistical overview for Admin dashboard
   */
  static async getDashboardStats() {
    const [
      totalUsers,
      totalCustomers,
      totalVendors,
      pendingVendors,
      approvedVendors,
      rejectedVendors,
      totalEnquiries,
      totalReviews,
      pendingReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.vendor.count(),
      prisma.vendor.count({ where: { approvalStatus: 'PENDING' } }),
      prisma.vendor.count({ where: { approvalStatus: 'APPROVED' } }),
      prisma.vendor.count({ where: { approvalStatus: 'REJECTED' } }),
      prisma.enquiry.count(),
      prisma.review.count(),
      prisma.review.count({ where: { moderationStatus: 'PENDING' } }),
    ]);

    const recentVendors = await prisma.vendor.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true, owner: { select: { fullName: true, email: true } } },
    });

    const recentEnquiries = await prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: { select: { businessName: true, slug: true } },
      },
    });

    return {
      stats: {
        totalUsers,
        totalCustomers,
        totalVendors,
        pendingVendors,
        approvedVendors,
        rejectedVendors,
        totalEnquiries,
        totalReviews,
        pendingReviews,
      },
      recentVendors,
      recentEnquiries,
    };
  }

  /**
   * List all vendors with admin filters
   */
  static async listVendors(query: {
    approvalStatus?: string;
    verificationStatus?: string;
    categoryId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.approvalStatus && query.approvalStatus !== 'all') {
      where.approvalStatus = query.approvalStatus;
    }
    if (query.verificationStatus && query.verificationStatus !== 'all') {
      where.verificationStatus = query.verificationStatus;
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.search) {
      where.OR = [
        { businessName: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { owner: { email: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [total, vendors] = await Promise.all([
      prisma.vendor.count({ where }),
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          owner: {
            select: { id: true, fullName: true, email: true, phone: true, status: true },
          },
          images: { take: 3 },
          _count: { select: { enquiries: true, reviews: true, packages: true } },
        },
      }),
    ]);

    return {
      vendors,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Approve or reject vendor with reason & audit logging
   */
  static async decideVendor(
    vendorId: string,
    decision: { status: 'APPROVED' | 'REJECTED'; rejectionReason?: string; verificationStatus?: 'UNVERIFIED' | 'VERIFIED' },
    adminUserId: string,
    req?: Request
  ) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { owner: true },
    });
    if (!vendor) throw new NotFoundError('Vendor not found');

    const updateData: any = {
      approvalStatus: decision.status,
      rejectionReason: decision.status === 'REJECTED' ? decision.rejectionReason : null,
      approvedAt: decision.status === 'APPROVED' ? new Date() : null,
    };

    if (decision.verificationStatus) {
      updateData.verificationStatus = decision.verificationStatus;
    }

    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data: updateData,
      include: { category: true, owner: true },
    });

    await AuditService.log({
      userId: adminUserId,
      action: `VENDOR_${decision.status}`,
      entityType: 'Vendor',
      entityId: vendorId,
      details: {
        vendorName: vendor.businessName,
        previousStatus: vendor.approvalStatus,
        newStatus: decision.status,
        rejectionReason: decision.rejectionReason,
        verificationStatus: decision.verificationStatus,
      },
      req,
    });

    return updated;
  }

  /**
   * Toggle vendor verification badge
   */
  static async setVendorVerification(
    vendorId: string,
    verificationStatus: 'UNVERIFIED' | 'VERIFIED',
    adminUserId: string,
    req?: Request
  ) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data: { verificationStatus },
    });

    await AuditService.log({
      userId: adminUserId,
      action: `VENDOR_VERIFICATION_${verificationStatus}`,
      entityType: 'Vendor',
      entityId: vendorId,
      details: { previous: vendor.verificationStatus, current: verificationStatus },
      req,
    });

    return updated;
  }

  /**
   * User management - list users
   */
  static async listUsers(query: { role?: string; status?: string; search?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          vendorProfile: {
            select: { id: true, businessName: true, approvalStatus: true },
          },
        },
      }),
    ]);

    return {
      users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Change user status (ACTIVE, SUSPENDED, DISABLED)
   */
  static async setUserStatus(
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'DISABLED',
    adminUserId: string,
    req?: Request
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    // Prevent admin from disabling themselves
    if (userId === adminUserId) {
      throw new Error('Administrators cannot change their own status');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, email: true, status: true },
    });

    // If suspending or disabling, revoke all refresh sessions immediately
    if (status !== 'ACTIVE') {
      await prisma.refreshSession.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    await AuditService.log({
      userId: adminUserId,
      action: `USER_STATUS_${status}`,
      entityType: 'User',
      entityId: userId,
      details: { previousStatus: user.status, newStatus: status, userEmail: user.email },
      req,
    });

    return updated;
  }

  /**
   * List reviews with moderation filter
   */
  static async listReviews(query: { moderationStatus?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.moderationStatus && query.moderationStatus !== 'all') {
      where.moderationStatus = query.moderationStatus;
    }

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: { select: { id: true, businessName: true, slug: true } },
          customer: { select: { id: true, fullName: true, email: true } },
        },
      }),
    ]);

    return {
      reviews,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * List audit logs
   */
  static async listAuditLogs(query: { entityType?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 25, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.entityType) {
      where.entityType = query.entityType;
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, fullName: true, email: true, role: true },
          },
        },
      }),
    ]);

    return {
      logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
