import { prisma } from '../../config/db';
import { ConflictError, NotFoundError } from '../../utils/errors';
import { APPROVAL_STATUSES, REVIEW_STATUSES } from '@kalyanaconnect/shared';

export class ReviewsService {
  /**
   * Submit a review for a vendor
   * Customer role only. Only 1 review per customer per vendor!
   */
  static async createReview(customerId: string, data: { vendorId: string; rating: number; comment: string }) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: data.vendorId },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    if (vendor.approvalStatus !== APPROVAL_STATUSES.APPROVED) {
      throw new NotFoundError('Vendor is not active');
    }

    // Check duplicate
    const existing = await prisma.review.findUnique({
      where: {
        vendorId_customerUserId: {
          vendorId: data.vendorId,
          customerUserId: customerId,
        },
      },
    });

    if (existing) {
      throw new ConflictError('You have already submitted a review for this vendor.');
    }

    const review = await prisma.review.create({
      data: {
        vendorId: data.vendorId,
        customerUserId: customerId,
        rating: data.rating,
        comment: data.comment.trim(),
        moderationStatus: REVIEW_STATUSES.PENDING,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return review;
  }

  /**
   * Get approved reviews for vendor
   */
  static async getVendorReviews(vendorId: string) {
    return prisma.review.findMany({
      where: {
        vendorId,
        moderationStatus: REVIEW_STATUSES.APPROVED,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });
  }

  /**
   * Admin: moderate review (APPROVE or REJECT)
   */
  static async moderateReview(reviewId: string, moderationStatus: any) {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundError('Review not found');

    return prisma.review.update({
      where: { id: reviewId },
      data: { moderationStatus },
    });
  }
}
