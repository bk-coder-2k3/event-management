import {
  UserRole,
  UserStatus,
  ApprovalStatus,
  VerificationStatus,
  EnquiryStatus,
  ReviewStatus,
  TamilNaduDistrict,
} from '../constants';

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    vendors: number;
  };
}

export interface VendorImageSummary {
  id: string;
  vendorId: string;
  imageUrl: string;
  storageKey: string;
  altText?: string | null;
  sortOrder: number;
  createdAt: string | Date;
}

export interface ServicePackageSummary {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number | string;
  currency: string;
  inclusions: string[];
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ReviewSummary {
  id: string;
  vendorId: string;
  customerUserId: string;
  rating: number;
  comment: string;
  moderationStatus: ReviewStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  customer?: {
    id: string;
    fullName: string;
  };
}

export interface VendorPublicSummary {
  id: string;
  ownerUserId: string;
  businessName: string;
  slug: string;
  categoryId: string;
  category?: CategorySummary;
  description: string;
  startingPrice: number | string | null;
  currency: string;
  attributes?: Record<string, any> | null;
  address: string;
  city: string;
  district: TamilNaduDistrict | string;
  state: string;
  postalCode: string;
  phone?: string | null;
  whatsappPhone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  approvalStatus: ApprovalStatus;
  verificationStatus: VerificationStatus;
  rejectionReason?: string | null;
  approvedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  images: VendorImageSummary[];
  packages?: ServicePackageSummary[];
  reviews?: ReviewSummary[];
  avgRating?: number;
  reviewCount?: number;
  isSaved?: boolean;
}

export interface EnquirySummary {
  id: string;
  customerUserId?: string | null;
  vendorId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventType?: string | null;
  eventDate?: string | Date | null;
  eventCity: string;
  budgetMin?: number | string | null;
  budgetMax?: number | string | null;
  requirements: string;
  status: EnquiryStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  vendor?: {
    id: string;
    businessName: string;
    slug: string;
    city: string;
    district: string;
    whatsappPhone?: string | null;
    images?: VendorImageSummary[];
  };
  customer?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface AuditLogSummary {
  id: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string | Date;
  user?: {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
  } | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  user: UserSummary;
}
