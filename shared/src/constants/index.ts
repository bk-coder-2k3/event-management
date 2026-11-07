export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUSES = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DISABLED: 'DISABLED',
} as const;

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export const APPROVAL_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[keyof typeof APPROVAL_STATUSES];

export const VERIFICATION_STATUSES = {
  UNVERIFIED: 'UNVERIFIED',
  VERIFIED: 'VERIFIED',
} as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[keyof typeof VERIFICATION_STATUSES];

export const ENQUIRY_STATUSES = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUOTED: 'QUOTED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CLOSED: 'CLOSED',
} as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[keyof typeof ENQUIRY_STATUSES];

export const REVIEW_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ReviewStatus = (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

// Tamil Nadu Districts with primary focus on Madurai & surrounding districts
export const TAMIL_NADU_DISTRICTS = [
  'Madurai',
  'Theni',
  'Dindigul',
  'Virudhunagar',
  'Sivaganga',
  'Ramanathapuram',
  'Tiruchirappalli',
  'Coimbatore',
  'Chennai',
  'Salem',
  'Tirunelveli',
  'Erode',
  'Thanjavur',
  'Kanyakumari',
  'Vellore',
  'Thoothukudi',
] as const;

export type TamilNaduDistrict = (typeof TAMIL_NADU_DISTRICTS)[number];

export const INITIAL_CATEGORIES = [
  {
    name: 'Marriage Halls & Mandapams',
    slug: 'venues',
    description: 'Traditional AC Kalyana Mandapams, luxury wedding halls, mini halls, and outdoor lawn resorts in Madurai & TN.',
    sortOrder: 1,
    icon: 'Building2',
  },
  {
    name: 'Photography & Videography',
    slug: 'photography',
    description: 'Traditional muhurtham photography, candid shots, cinematic 4K drone videography and pre-wedding shoots.',
    sortOrder: 2,
    icon: 'Camera',
  },
  {
    name: 'Stage Decoration & Florals',
    slug: 'decoration',
    description: 'Grand reception backdrops, authentic temple flower decor, jasmine garlands, entrance arches, and lighting.',
    sortOrder: 3,
    icon: 'Sparkles',
  },
  {
    name: 'Catering & Traditional Feast',
    slug: 'catering',
    description: 'Authentic South Indian banana leaf wedding virundhu, Chettinad specialties, Brahmin feast, sweets & live stalls.',
    sortOrder: 4,
    icon: 'UtensilsCrossed',
  },
  {
    name: 'Makeup Artists & Bridal Styling',
    slug: 'makeup',
    description: 'Expert bridal Muhurtham makeover, HD/Airbrush makeup, saree draping, hairstyle, and Mehendi artists.',
    sortOrder: 5,
    icon: 'Palette',
  },
  {
    name: 'Bridal Wear & Jewellery',
    slug: 'bridal-wear',
    description: 'Pure Kanchipuram silk sarees, groom pattu veshti, rental antique temple jewellery, and designer sherwanis.',
    sortOrder: 6,
    icon: 'Crown',
  },
  {
    name: 'Music & Traditional Nadaswaram',
    slug: 'entertainment',
    description: 'Mangala Vaathiyam (Nadaswaram & Thavil), live Carnatic vocalists, DJ sound systems, and wedding bands.',
    sortOrder: 7,
    icon: 'Music',
  },
  {
    name: 'Wedding Planners & Coordinators',
    slug: 'wedding-planners',
    description: 'Complete end-to-end wedding management, seer plate arrangements, guest reception, and ritual coordination.',
    sortOrder: 8,
    icon: 'CalendarHeart',
  },
  {
    name: 'Invitation Cards & Favors',
    slug: 'invitations',
    description: 'Custom royal wedding cards, eco-friendly invites, video invitations, and traditional Thamboolam gift bags.',
    sortOrder: 9,
    icon: 'Mail',
  },
] as const;
