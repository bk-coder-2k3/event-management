import { z } from 'zod';
import {
  APPROVAL_STATUSES,
  ENQUIRY_STATUSES,
  REVIEW_STATUSES,
  ROLES,
  TAMIL_NADU_DISTRICTS,
  VERIFICATION_STATUSES,
} from '../constants';

// Clean phone number: Indian numbers e.g. +91 9876543210 or 9876543210
const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

// 1. Auth Schemas
export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Please enter a valid 10-digit Indian phone number (e.g., 9876543210)')
    .optional()
    .or(z.literal('')),
  // Note: Only CUSTOMER or VENDOR can register. ADMIN role is forbidden at registration!
  role: z.enum([ROLES.CUSTOMER, ROLES.VENDOR]).default(ROLES.CUSTOMER),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// 2. Vendor Profile Schemas
export const createVendorSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required').max(150),
  categoryId: z.string().uuid('Invalid category ID'),
  description: z.string().trim().min(20, 'Please provide a detailed description of at least 20 characters').max(5000),
  startingPrice: z.coerce.number().min(0, 'Starting price cannot be negative').optional().nullable(),
  currency: z.string().default('INR'),
  attributes: z.record(z.any()).optional().nullable(),
  address: z.string().trim().min(5, 'Address is required').max(300),
  city: z.string().trim().min(2, 'City is required').max(100),
  district: z.string().trim().min(2, 'District is required').max(100),
  state: z.string().default('Tamil Nadu'),
  postalCode: z.string().trim().regex(/^\d{6}$/, 'Postal code must be a valid 6-digit Indian PIN code'),
  phone: z.string().trim().regex(phoneRegex, 'Invalid phone number').optional().nullable().or(z.literal('')),
  whatsappPhone: z.string().trim().regex(phoneRegex, 'Invalid WhatsApp number').optional().nullable().or(z.literal('')),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export const updateVendorSchema = createVendorSchema.partial();

export const adminVendorDecisionSchema = z
  .object({
    status: z.enum([APPROVAL_STATUSES.APPROVED, APPROVAL_STATUSES.REJECTED]),
    rejectionReason: z.string().trim().max(500).optional().nullable(),
    verificationStatus: z.enum([VERIFICATION_STATUSES.UNVERIFIED, VERIFICATION_STATUSES.VERIFIED]).optional(),
  })
  .refine(
    (data) => {
      if (data.status === APPROVAL_STATUSES.REJECTED && (!data.rejectionReason || data.rejectionReason.length < 5)) {
        return false;
      }
      return true;
    },
    {
      message: 'A rejection reason of at least 5 characters is required when rejecting a vendor.',
      path: ['rejectionReason'],
    }
  );

// 3. Service Package Schemas
export const createPackageSchema = z.object({
  name: z.string().trim().min(2, 'Package name is required').max(100),
  description: z.string().trim().min(10, 'Package description is required').max(2000),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  currency: z.string().default('INR'),
  inclusions: z.array(z.string().trim().min(1)).min(1, 'At least one inclusion is required'),
  isActive: z.boolean().default(true),
});

export const updatePackageSchema = createPackageSchema.partial();

// 4. Enquiry Schemas
export const createEnquirySchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID'),
  customerName: z.string().trim().min(2, 'Name is required').max(100),
  customerEmail: z.string().trim().toLowerCase().email('Invalid email address'),
  customerPhone: z.string().trim().regex(phoneRegex, 'Valid 10-digit phone number is required'),
  eventType: z.string().trim().optional().nullable(),
  eventDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().nullable(),
  eventCity: z.string().trim().min(2, 'Event city is required').max(100),
  budgetMin: z.coerce.number().min(0).optional().nullable(),
  budgetMax: z.coerce.number().min(0).optional().nullable(),
  requirements: z.string().trim().min(10, 'Please detail your requirements (min 10 characters)').max(3000),
}).refine(
  (data) => {
    if (data.budgetMin && data.budgetMax && data.budgetMin > data.budgetMax) {
      return false;
    }
    return true;
  },
  {
    message: 'Minimum budget cannot exceed maximum budget',
    path: ['budgetMax'],
  }
);

export const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    ENQUIRY_STATUSES.NEW,
    ENQUIRY_STATUSES.CONTACTED,
    ENQUIRY_STATUSES.QUOTED,
    ENQUIRY_STATUSES.ACCEPTED,
    ENQUIRY_STATUSES.DECLINED,
    ENQUIRY_STATUSES.CLOSED,
  ]),
});

// 5. Review Schemas
export const createReviewSchema = z.object({
  vendorId: z.string().uuid('Invalid vendor ID'),
  rating: z.coerce.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().trim().min(5, 'Review comment must be at least 5 characters').max(2000),
});

export const moderateReviewSchema = z.object({
  moderationStatus: z.enum([REVIEW_STATUSES.APPROVED, REVIEW_STATUSES.REJECTED]),
});

// 6. Marketplace Directory Query
export const vendorQuerySchema = z.object({
  district: z.string().trim().optional(),
  city: z.string().trim().optional(),
  category: z.string().trim().optional(), // slug or categoryId
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'rating', 'newest']).default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

// 7. Category Management Schemas
export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and dashes'),
  description: z.string().trim().min(5).max(500),
  icon: z.string().trim().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();
