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

export const EVENT_TYPES = [
  'Wedding & Reception',
  'Engagement & Betrothal',
  'Birthday Party & Milestone Celebration',
  'Corporate Event & Conference',
  'Baby Shower (Seemantham)',
  'Housewarming (Grahapravesam)',
  'Sacred Ceremony & Upanayanam',
  'Anniversary Celebration',
  'Cultural & College Fest',
  'Private Party & Social Gathering',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const INITIAL_CATEGORIES = [
  {
    name: 'Event Venues & Banquet Halls',
    slug: 'venues',
    description: 'Traditional AC Kalyana Mandapams, luxury banquet halls, mini party halls, corporate conference halls, and lawn resorts.',
    sortOrder: 1,
    icon: 'Building2',
  },
  {
    name: 'Photography & Videography',
    slug: 'photography',
    description: 'Candid wedding moments, birthday shoots, corporate event coverage, cinematic 4K drone films, and family portraits.',
    sortOrder: 2,
    icon: 'Camera',
  },
  {
    name: 'Stage Decoration & Theme Styling',
    slug: 'decoration',
    description: 'Grand wedding mandapams, kids birthday themes, corporate stage setups, floral arches, backdrops, and mood lighting.',
    sortOrder: 3,
    icon: 'Sparkles',
  },
  {
    name: 'Catering & Food Services',
    slug: 'catering',
    description: 'Authentic South Indian banana leaf feasts, multi-cuisine banquets, corporate high-tea, live food counters & desserts.',
    sortOrder: 4,
    icon: 'UtensilsCrossed',
  },
  {
    name: 'Makeup Artists & Personal Styling',
    slug: 'makeup',
    description: 'Bridal Muhurtham makeovers, party glam, saree draping, hairstyling, groom styling, and grooming.',
    sortOrder: 5,
    icon: 'Palette',
  },
  {
    name: 'Occasion Wear & Jewellery',
    slug: 'bridal-wear',
    description: 'Pure Kanchipuram silk sarees, designer sherwanis, party suits, rental antique temple jewellery, and accessories.',
    sortOrder: 6,
    icon: 'Crown',
  },
  {
    name: 'Music, DJs & Live Entertainment',
    slug: 'entertainment',
    description: 'Traditional Mangala Vaathiyam, live fusion bands, DJ sound & lighting, anchors/MCs, and birthday entertainers.',
    sortOrder: 7,
    icon: 'Music',
  },
  {
    name: 'Event Planners & Coordinators',
    slug: 'wedding-planners',
    description: 'End-to-end event planning and day-of coordination for weddings, corporate galas, and milestone parties.',
    sortOrder: 8,
    icon: 'CalendarHeart',
  },
  {
    name: 'Invitations, E-Invites & Favors',
    slug: 'invitations',
    description: 'Custom wedding cards, digital video invites, birthday party invitations, corporate stationery, and return gifts.',
    sortOrder: 9,
    icon: 'Mail',
  },
] as const;

export interface CategoryFieldDef {
  key: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'multiselect' | 'boolean';
  placeholder?: string;
  unit?: string;
  options?: string[];
  helpText?: string;
}

export const CATEGORY_SPECIFICATIONS: Record<string, CategoryFieldDef[]> = {
  venues: [
    {
      key: 'venueType',
      label: 'Venue Type',
      type: 'select',
      options: [
        'Traditional Kalyana Mandapam',
        'Luxury Banquet Hall',
        'Mini Party / Birthday Hall',
        'Corporate Conference Center',
        'Lawn & Outdoor Resort',
      ],
    },
    {
      key: 'supportedEvents',
      label: 'Supported Event Types',
      type: 'multiselect',
      options: [
        'Weddings & Receptions',
        'Birthday Parties & Milestones',
        'Corporate Conferences & Meets',
        'Baby Shower (Seemantham)',
        'Housewarming (Grahapravesam)',
        'Sacred Ceremonies & Upanayanam',
        'Social Gatherings & Parties',
      ],
    },
    {
      key: 'seatingCapacity',
      label: 'Hall Seating Capacity',
      type: 'number',
      unit: 'Guests',
      placeholder: 'e.g. 1000',
      helpText: 'Maximum seated capacity in the main hall',
    },
    {
      key: 'diningCapacity',
      label: 'Dining Hall Capacity',
      type: 'number',
      unit: 'Guests',
      placeholder: 'e.g. 400',
      helpText: 'Seated dining capacity for traditional or buffet meals',
    },
    {
      key: 'acRoomsCount',
      label: 'AC Deluxe Guest Rooms',
      type: 'number',
      unit: 'Rooms',
      placeholder: 'e.g. 12',
      helpText: 'Number of air-conditioned rooms for hosts & guests',
    },
    {
      key: 'parkingCapacity',
      label: 'Vehicle Parking Capacity',
      type: 'number',
      unit: 'Cars',
      placeholder: 'e.g. 100',
    },
    {
      key: 'foodPolicy',
      label: 'Food & Catering Policy',
      type: 'select',
      options: [
        'Pure Vegetarian Only',
        'Vegetarian & Non-Vegetarian Allowed',
        'In-House Catering Mandatory',
        'Outside Catering Permitted',
      ],
    },
    {
      key: 'airConditioned',
      label: 'Centralized Air Conditioning',
      type: 'boolean',
    },
    {
      key: 'powerBackup',
      label: 'Full Generator Power Backup',
      type: 'boolean',
    },
  ],
  photography: [
    {
      key: 'eventsCovered',
      label: 'Events Covered',
      type: 'multiselect',
      options: [
        'Weddings & Receptions',
        'Birthday Parties & Milestones',
        'Corporate Events & Conclaves',
        'Baby Showers & Family Portraits',
        'Cultural Fests & Functions',
      ],
    },
    {
      key: 'styles',
      label: 'Photography Styles Covered',
      type: 'multiselect',
      options: [
        'Candid Photography',
        'Traditional Muhurtham / Event Coverage',
        'Cinematic 4K Videography',
        'Drone Aerial Shoots',
        'Pre/Post-Event Shoots',
      ],
    },
    {
      key: 'deliverables',
      label: 'Deliverables Included',
      type: 'multiselect',
      options: [
        'Premium Canvera / Flush Mount Album',
        'Cinematic Highlight Teaser (3-5 min)',
        'Full HD/4K Edited Event Film',
        'Raw Footage & Photos (Pendrive/Cloud)',
      ],
    },
    {
      key: 'deliveryWeeks',
      label: 'Estimated Album Delivery Timeline',
      type: 'number',
      unit: 'Weeks',
      placeholder: 'e.g. 4',
    },
    {
      key: 'travelOutstation',
      label: 'Available for Outstation / Destination Events',
      type: 'boolean',
    },
  ],
  catering: [
    {
      key: 'serviceStyles',
      label: 'Service Style',
      type: 'multiselect',
      options: [
        'Traditional Banana Leaf Virundhu',
        'Modern Grand Buffet',
        'Corporate Buffet Lunch & High Tea',
        'Birthday Party Snacks & Live Counters',
        'Live Food & Chaat Counters',
        'VIP Table Service',
      ],
    },
    {
      key: 'cuisines',
      label: 'Cuisine Specialties',
      type: 'multiselect',
      options: [
        'South Indian Brahmin Feast',
        'Authentic Chettinad Virundhu',
        'Kongu Nadu Specialties',
        'North Indian & Tandoori',
        'Continental & Chinese',
        'Pure Jain Menu',
      ],
    },
    {
      key: 'pricePerPlateVeg',
      label: 'Veg Meal Price (per leaf/plate)',
      type: 'number',
      unit: '₹',
      placeholder: 'e.g. 450',
    },
    {
      key: 'pricePerPlateNonVeg',
      label: 'Non-Veg Meal Price (per plate, optional)',
      type: 'number',
      unit: '₹',
      placeholder: 'e.g. 650',
    },
    {
      key: 'minGuests',
      label: 'Minimum Guest Order Count',
      type: 'number',
      unit: 'Guests',
      placeholder: 'e.g. 50',
    },
  ],
  decoration: [
    {
      key: 'decorThemes',
      label: 'Decor Specialties & Themes',
      type: 'multiselect',
      options: [
        'Authentic Madurai Temple Flower Decor',
        'Fragrant Jasmine (Malli) Garlands',
        'Grand Royal Palace Theme',
        'Modern LED & Crystal Backdrop',
        'Kids Birthday & Balloon Theme Sets',
        'Corporate Stage & Conference Backdrops',
        'Baby Shower / Cradle Ceremony Decor',
        'Eco-Friendly Banana Stem & Coconut Leaf',
      ],
    },
    {
      key: 'lightingIncluded',
      label: 'Stage & Venue Accent Lighting Included',
      type: 'boolean',
    },
    {
      key: 'customDesigns',
      label: 'Custom 3D / Tailored Backdrops Supported',
      type: 'boolean',
    },
  ],
  makeup: [
    {
      key: 'makeoverTypes',
      label: 'Makeover & Styling Services',
      type: 'multiselect',
      options: [
        'HD Muhurtham Bridal Makeover',
        'Party & Reception Glam',
        'Airbrush Makeup',
        'Traditional Silk Saree Draping',
        'Groom Styling & Hair Care',
        'Mehendi / Henna Art',
      ],
    },
    {
      key: 'cosmeticsBrands',
      label: 'Cosmetics Brands Used',
      type: 'multiselect',
      options: [
        'MAC Cosmetics',
        'Bobbi Brown',
        'Huda Beauty',
        'Kryolan Professional',
        'Estée Lauder',
      ],
    },
    {
      key: 'trialAvailable',
      label: 'Trial Session Available',
      type: 'boolean',
    },
    {
      key: 'travelToVenue',
      label: 'Travels to Event Venue / Home',
      type: 'boolean',
    },
  ],
  entertainment: [
    {
      key: 'troupeType',
      label: 'Entertainment & Music Format',
      type: 'select',
      options: [
        'Mangala Vaathiyam (Nadaswaram & Thavil)',
        'DJ, Sound & Dance Floor Lighting',
        'Live Fusion Band / Orchestra',
        'Live Carnatic Classical Instrumental',
        'Anchor / MC & Game Shows',
        'Magician & Kids Party Entertainer',
      ],
    },
    {
      key: 'troupeMembers',
      label: 'Number of Artists / Crew',
      type: 'number',
      unit: 'Artists',
      placeholder: 'e.g. 4',
    },
    {
      key: 'coverageHours',
      label: 'Coverage Duration',
      type: 'select',
      options: [
        'Ceremony / Rituals (3-4 hours)',
        'Evening Party / Reception (4-6 hours)',
        'Full Day Event (8-10 hours)',
        'Multi-Day Celebrations',
      ],
    },
  ],
  'bridal-wear': [
    {
      key: 'garmentTypes',
      label: 'Collection Offerings',
      type: 'multiselect',
      options: [
        'Pure Kanchipuram Handloom Silk Sarees',
        'Groom Traditional Pattu Veshti & Angavastram',
        'Designer Sherwanis, Suits & Indo-Western',
        'Party Gowns & Lehengas',
        'Rental Antique Temple Jewellery Sets',
      ],
    },
    {
      key: 'rentalAvailable',
      label: 'Rental Jewellery Sets Available',
      type: 'boolean',
    },
    {
      key: 'customTailoring',
      label: 'Custom Blouse Aari Embroidery & Tailoring',
      type: 'boolean',
    },
  ],
  'wedding-planners': [
    {
      key: 'services',
      label: 'Planning & Coordination Services',
      type: 'multiselect',
      options: [
        'Complete End-to-End Event Management',
        'Day-Of Event Coordination',
        'Corporate Event & Conference Planning',
        'Milestone Birthday Party Organization',
        'Intimate Family Functions & Betrothal',
        'Traditional Seer Plate & Thamboolam Decor',
        'Guest Hospitality & Transport Logistics',
        'Budget Optimization & Vendor Management',
      ],
    },
  ],
  invitations: [
    {
      key: 'cardFormats',
      label: 'Invitation Formats Available',
      type: 'multiselect',
      options: [
        'Traditional Royal Box Cards',
        'Eco-Friendly Seed Paper Invites',
        'Digital Animated Video Invitations',
        'Birthday & Theme Party Invitations',
        'Corporate Conference Passes & Badges',
        'Custom Thamboolam Gift Bags & Return Favors',
      ],
    },
    {
      key: 'customCalligraphy',
      label: 'Tamil & English Custom Calligraphy Printing',
      type: 'boolean',
    },
  ],
};
