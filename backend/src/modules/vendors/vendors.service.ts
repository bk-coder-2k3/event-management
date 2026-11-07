import { prisma } from '../../config/db';
import { generateSlug } from '../../utils/slugify';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../utils/errors';
import { APPROVAL_STATUSES, ROLES } from '@kalyanaconnect/shared';
import { storageService } from '../../services/storageService';
import { Prisma } from '@prisma/client';

export class VendorsService {
  /**
   * Create a new vendor profile for authenticated vendor user
   */
  static async createVendor(userId: string, data: any) {
    // Check if user already has a vendor profile
    const existing = await prisma.vendor.findUnique({
      where: { ownerUserId: userId },
    });
    if (existing) {
      throw new ConflictError('You have already registered a vendor profile.');
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundError('Selected wedding service category does not exist');
    }

    // Generate unique slug
    let slug = generateSlug(data.businessName);
    const existingSlug = await prisma.vendor.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const vendor = await prisma.vendor.create({
      data: {
        ownerUserId: userId,
        businessName: data.businessName.trim(),
        slug,
        categoryId: data.categoryId,
        description: data.description.trim(),
        startingPrice: data.startingPrice !== undefined && data.startingPrice !== null ? data.startingPrice : null,
        currency: data.currency || 'INR',
        address: data.address.trim(),
        city: data.city.trim(),
        district: data.district.trim(),
        state: data.state || 'Tamil Nadu',
        postalCode: data.postalCode.trim(),
        phone: data.phone?.trim() || null,
        whatsappPhone: data.whatsappPhone?.trim() || null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        approvalStatus: 'PENDING',
        verificationStatus: 'UNVERIFIED',
      },
      include: {
        category: true,
      },
    });

    return vendor;
  }

  /**
   * Get public marketplace directory of vendors
   * Filters: district, city, category (slug or id), minPrice, maxPrice, search, sortBy
   * Strictly filters approvalStatus: APPROVED
   */
  static async getPublicVendors(query: {
    district?: string;
    city?: string;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const where: Prisma.VendorWhereInput = {
      approvalStatus: APPROVAL_STATUSES.APPROVED,
    };

    if (query.district && query.district !== 'all') {
      where.district = { equals: query.district, mode: 'insensitive' };
    }

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.category && query.category !== 'all') {
      where.category = {
        OR: [{ id: query.category }, { slug: query.category }],
      };
    }

    if (query.search) {
      const searchTerms = query.search.trim();
      where.OR = [
        { businessName: { contains: searchTerms, mode: 'insensitive' } },
        { description: { contains: searchTerms, mode: 'insensitive' } },
        { city: { contains: searchTerms, mode: 'insensitive' } },
        { district: { contains: searchTerms, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.startingPrice = {};
      if (query.minPrice !== undefined) {
        where.startingPrice.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.startingPrice.lte = query.maxPrice;
      }
    }

    // Determine orderBy
    let orderBy: Prisma.VendorOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'price_asc') {
      orderBy = { startingPrice: 'asc' };
    } else if (query.sortBy === 'price_desc') {
      orderBy = { startingPrice: 'desc' };
    } else if (query.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [total, vendors] = await Promise.all([
      prisma.vendor.count({ where }),
      prisma.vendor.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 5,
          },
          packages: {
            where: { isActive: true },
            take: 3,
          },
          reviews: {
            where: { moderationStatus: 'APPROVED' },
            select: { rating: true },
          },
        },
      }),
    ]);

    // Calculate rating statistics
    const data = vendors.map((vendor) => {
      const approvedReviews = vendor.reviews;
      const reviewCount = approvedReviews.length;
      const avgRating =
        reviewCount > 0
          ? Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
          : 0;

      const { reviews, ...rest } = vendor;
      return {
        ...rest,
        avgRating,
        reviewCount,
      };
    });

    if (query.sortBy === 'rating') {
      data.sort((a, b) => b.avgRating - a.avgRating);
    }

    return {
      vendors: data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get vendor detail by slug
   */
  static async getVendorBySlug(slug: string, requestingUser?: { userId: string; role: string }) {
    const vendor = await prisma.vendor.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        packages: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        reviews: {
          where: { moderationStatus: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // If vendor is not approved, only the owner or an ADMIN can view it
    if (vendor.approvalStatus !== APPROVAL_STATUSES.APPROVED) {
      const isOwner = requestingUser?.userId === vendor.ownerUserId;
      const isAdmin = requestingUser?.role === ROLES.ADMIN;
      if (!isOwner && !isAdmin) {
        throw new NotFoundError('Vendor profile is currently pending administrative review');
      }
    }

    const reviewCount = vendor.reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((vendor.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    return {
      ...vendor,
      avgRating,
      reviewCount,
    };
  }

  /**
   * Get logged-in vendor's own profile
   */
  static async getVendorMe(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { ownerUserId: userId },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        packages: {
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found for this account');
    }

    return vendor;
  }

  /**
   * Update vendor profile
   * Restricted: Vendor can only update their own profile, cannot change approvalStatus or verificationStatus
   */
  static async updateVendor(vendorId: string, userId: string, userRole: string, data: any) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Ownership check
    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('You can only update your own vendor profile');
    }

    // Sanitize protected fields - prevent privilege escalation
    delete data.approvalStatus;
    delete data.verificationStatus;
    delete data.rejectionReason;
    delete data.approvedAt;
    delete data.ownerUserId;

    if (data.businessName && data.businessName !== vendor.businessName) {
      data.slug = generateSlug(data.businessName);
    }

    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data,
      include: {
        category: true,
      },
    });

    return updated;
  }

  /**
   * Upload vendor portfolio image
   */
  static async addImage(vendorId: string, userId: string, userRole: string, file: Express.Multer.File, altText?: string) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('You are not authorized to upload photos for this vendor');
    }

    // Upload via storage service
    const uploadResult = await storageService.uploadImage(file, `vendors/${vendorId}`);

    // Count existing images to set sort order
    const count = await prisma.vendorImage.count({ where: { vendorId } });

    const image = await prisma.vendorImage.create({
      data: {
        vendorId,
        imageUrl: uploadResult.url,
        storageKey: uploadResult.storageKey,
        altText: altText || vendor.businessName,
        sortOrder: count,
      },
    });

    return image;
  }

  /**
   * Delete vendor portfolio image
   */
  static async deleteImage(vendorId: string, imageId: string, userId: string, userRole: string) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('You are not authorized to delete photos for this vendor');
    }

    const image = await prisma.vendorImage.findFirst({
      where: { id: imageId, vendorId },
    });
    if (!image) throw new NotFoundError('Image not found');

    await storageService.deleteImage(image.storageKey);
    await prisma.vendorImage.delete({ where: { id: imageId } });

    return { message: 'Image deleted successfully' };
  }
}
