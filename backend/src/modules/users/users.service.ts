import { prisma } from '../../config/db';
import { ConflictError, NotFoundError } from '../../utils/errors';

export class UsersService {
  /**
   * Save a vendor to customer's wishlist
   */
  static async saveVendor(customerId: string, vendorId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    const existing = await prisma.savedVendor.findUnique({
      where: {
        customerUserId_vendorId: {
          customerUserId: customerId,
          vendorId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.savedVendor.create({
      data: {
        customerUserId: customerId,
        vendorId,
      },
    });
  }

  /**
   * Unsave vendor
   */
  static async unsaveVendor(customerId: string, vendorId: string) {
    await prisma.savedVendor.deleteMany({
      where: {
        customerUserId: customerId,
        vendorId,
      },
    });
    return { message: 'Vendor removed from saved list' };
  }

  /**
   * Get saved vendors for customer
   */
  static async getSavedVendors(customerId: string) {
    const saved = await prisma.savedVendor.findMany({
      where: { customerUserId: customerId },
      include: {
        vendor: {
          include: {
            category: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
            },
            reviews: {
              where: { moderationStatus: 'APPROVED' },
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return saved.map((item) => {
      const reviewCount = item.vendor.reviews.length;
      const avgRating =
        reviewCount > 0
          ? Number((item.vendor.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1))
          : 0;

      const { reviews, ...vendorWithoutReviews } = item.vendor;
      return {
        ...item,
        vendor: {
          ...vendorWithoutReviews,
          avgRating,
          reviewCount,
        },
      };
    });
  }

  /**
   * Update user's personal profile (Name, phone)
   */
  static async updateProfile(userId: string, data: { fullName?: string; phone?: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName?.trim(),
        phone: data.phone?.trim() || null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });
  }
}
