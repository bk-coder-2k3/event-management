import { prisma } from '../../config/db';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { APPROVAL_STATUSES, ROLES } from '@vizhaspace/shared';

export class EnquiriesService {
  /**
   * Submit a new enquiry to a vendor
   */
  static async createEnquiry(data: any, customerUserId?: string | null) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: data.vendorId },
      include: { owner: true },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    if (vendor.approvalStatus !== APPROVAL_STATUSES.APPROVED) {
      throw new NotFoundError('This vendor profile is currently not taking new enquiries');
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        vendorId: data.vendorId,
        customerUserId: customerUserId || null,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.toLowerCase().trim(),
        customerPhone: data.customerPhone.trim(),
        eventType: data.eventType?.trim() || null,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventCity: data.eventCity.trim(),
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        requirements: data.requirements.trim(),
        status: 'NEW',
      },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            city: true,
            district: true,
            whatsappPhone: true,
            phone: true,
          },
        },
      },
    });

    return enquiry;
  }

  /**
   * Get enquiries for customer
   */
  static async getCustomerEnquiries(customerId: string) {
    return prisma.enquiry.findMany({
      where: { customerUserId: customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            city: true,
            district: true,
            phone: true,
            whatsappPhone: true,
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Get enquiries for vendor inbox
   */
  static async getVendorEnquiries(userId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { ownerUserId: userId },
    });

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
    }

    return prisma.enquiry.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  /**
   * Update enquiry status (Vendor or Admin)
   */
  static async updateEnquiryStatus(enquiryId: string, status: any, userId: string, userRole: string) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: { vendor: true },
    });

    if (!enquiry) {
      throw new NotFoundError('Enquiry not found');
    }

    if (enquiry.vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('Unauthorized to update this enquiry');
    }

    return prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status },
    });
  }
}
