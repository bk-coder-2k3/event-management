import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES } from '@kalyanaconnect/shared';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KalyanaConnect database seed...');

  // 1. Seed Categories
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }
  console.log('✅ Wedding service categories seeded.');

  // 2. Seed Admin User
  const adminPasswordHash = await argon2.hash('AdminSecure#2026', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kalyanaconnect.com' },
    update: {},
    create: {
      fullName: 'KalyanaConnect Platform Admin',
      email: 'admin@kalyanaconnect.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });
  console.log('✅ Admin user verified:', admin.email);

  // 3. Seed Sample Customer User
  const customerPasswordHash = await argon2.hash('CustomerPass#2026', {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });

  const customer = await prisma.user.upsert({
    where: { email: 'karthik@example.com' },
    update: {},
    create: {
      fullName: 'Karthik Subramanian',
      email: 'karthik@example.com',
      phone: '9842100001',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
    },
  });

  // 4. Seed Sample Vendors in Madurai and surrounding districts
  const sampleVendorsData = [
    {
      ownerEmail: 'meenakshi.hall@example.com',
      ownerName: 'Sundararajan M',
      businessName: 'Sri Meenakshi Sundareswarar Kalyana Mandapam',
      slug: 'sri-meenakshi-sundareswarar-kalyana-mandapam',
      categorySlug: 'venues',
      description:
        'A magnificent traditional wedding hall located in the heart of Madurai near the historic temple. Features a grand centralized air-conditioned muhurtham hall with 1,200 seating capacity, modern banquet dining for 500 guests, 15 deluxe guest rooms, and valet parking for over 100 cars.',
      startingPrice: 150000,
      address: '42, West Veli Street, Near Meenakshi Amman Temple',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625001',
      phone: '9842112345',
      whatsappPhone: '9842112345',
      latitude: 9.9195,
      longitude: 78.1193,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Grand Muhurtham Package (2 Days)',
          description: 'Includes full air-conditioned hall for Reception & Muhurtham, bride & groom suite, and backup generator.',
          price: 180000,
          inclusions: ['Main AC Hall', 'Dining Hall', '10 Deluxe AC Rooms', '24/7 Generator Backup', 'Cleaning Staff'],
        },
      ],
    },
    {
      ownerEmail: 'pandian.candid@example.com',
      ownerName: 'Vignesh Pandian',
      businessName: 'Vaigai Memories Candid Photography & Films',
      slug: 'vaigai-memories-candid-photography-films',
      categorySlug: 'photography',
      description:
        'Award-winning wedding photography collective based in Madurai specializing in candid south Indian wedding moments, traditional Brahmin & Chettinad ceremonies, 4K cinematic teasers, and pre-wedding destination shoots.',
      startingPrice: 75000,
      address: '15B, Bypass Road, Ponmeni',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625010',
      phone: '9842234567',
      whatsappPhone: '9842234567',
      latitude: 9.9255,
      longitude: 78.0982,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Royal Candid & Cinematic Story',
          description: '2 Candid Photographers, 2 Cinematographers, Drone aerial coverage, and Premium leather album.',
          price: 110000,
          inclusions: ['4-person crew', 'Candid Moments', '4K Wedding Film', 'Drone Coverage', 'Premium 40-page Album'],
        },
      ],
    },
    {
      ownerEmail: 'chettinad.feast@example.com',
      ownerName: 'Alagappan Chettiar',
      businessName: 'Muthu Chettinad Royal Wedding Catering',
      slug: 'muthu-chettinad-royal-wedding-catering',
      categorySlug: 'catering',
      description:
        'Authentic South Indian wedding feast served on traditional plantain leaves. Famous for Madurai special Kari Dosa, authentic Chettinad Virundhu, rich vegetarian Kalyana Sappadu, and mouth-watering Madurai Jigarthanda live stall.',
      startingPrice: 450,
      address: '88, Alagarkoil Main Road, Tallakulam',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625002',
      phone: '9842345678',
      whatsappPhone: '9842345678',
      latitude: 9.9388,
      longitude: 78.1345,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Traditional 32-Item Banana Leaf Kalyana Virundhu',
          description: 'Per leaf price for authentic traditional feast with sweets, vadai, sambar, rasam, payasam, and fruit salad.',
          price: 550,
          inclusions: ['32 Traditional items', 'Uniformed servers', 'Pure Ghee preparation', 'Welcome Drinks & Jigarthanda'],
        },
      ],
    },
    {
      ownerEmail: 'malligai.decor@example.com',
      ownerName: 'Kavitha Murugan',
      businessName: 'Malligai Bloom Wedding Stage & Florals',
      slug: 'malligai-bloom-wedding-stage-florals',
      categorySlug: 'decoration',
      description:
        'Creating breathtaking wedding stages infused with the fragrance of famous Madurai Malli (jasmine). Specializes in grand temple-style floral mandapams, modern pastel LED reception sets, and entrance floral arches.',
      startingPrice: 60000,
      address: '24, Mattuthavani Flower Market Road',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625007',
      phone: '9842456789',
      whatsappPhone: '9842456789',
      latitude: 9.9482,
      longitude: 78.1567,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Divine Temple Floral Mandapam',
          description: 'Authentic lotus & Madurai jasmine floral mandapam with warm temple pendant lights.',
          price: 85000,
          inclusions: ['Temple mandapam dome', 'Fresh Madurai jasmine', 'Entrance arch', 'Name board', 'LED focus lights'],
        },
      ],
    },
    {
      ownerEmail: 'nadaswaram.troupe@example.com',
      ownerName: 'Manickam Pillai',
      businessName: 'Thirupparankundram Nadaswaram & Thavil Vidwans',
      slug: 'thirupparankundram-nadaswaram-thavil-vidwans',
      categorySlug: 'entertainment',
      description:
        'Heritage Mangala Vaathiyam ensemble from Thirupparankundram performing authentic Muhurtha classical ragas, traditional welcoming tunes, and divine wedding melodies.',
      startingPrice: 25000,
      address: '5, Sannathi Street, Thirupparankundram',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625005',
      phone: '9842567890',
      whatsappPhone: '9842567890',
      latitude: 9.8785,
      longitude: 78.0722,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Complete Muhurtham Ensemble (5 Artists)',
          description: '2 Nadaswaram Vidwans, 2 Thavil Vidwans, and 1 Thalam artist for Reception and Muhurtham.',
          price: 35000,
          inclusions: ['5 Professional Vidwans', 'Reception music', 'Muhurtham rituals', 'Traditional dress'],
        },
      ],
    },
    {
      ownerEmail: 'ananya.bridal@example.com',
      ownerName: 'Ananya Ramesh',
      businessName: 'Ananya Bridal Studio & HD Makeover',
      slug: 'ananya-bridal-studio-hd-makeover',
      categorySlug: 'makeup',
      description:
        'Certified celebrity bridal stylist in Madurai offering long-lasting sweat-proof HD Muhurtham makeup, authentic South Indian temple bridal hairstyling, flower setting, and saree draping.',
      startingPrice: 18000,
      address: '71, KK Nagar Main Road',
      city: 'Madurai',
      district: 'Madurai',
      postalCode: '625020',
      phone: '9842678901',
      whatsappPhone: '9842678901',
      latitude: 9.9298,
      longitude: 78.1456,
      approvalStatus: 'APPROVED' as const,
      verificationStatus: 'VERIFIED' as const,
      images: [
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
      ],
      packages: [
        {
          name: 'Muhurtham & Reception Royal Makeover',
          description: 'High-definition airbrush makeup, hair styling with fresh jasmine, and luxury saree draping.',
          price: 28000,
          inclusions: ['HD Airbrush Makeup', 'Hairstyling', 'Saree Draping', 'Jewellery Assistance', 'Touchup kit'],
        },
      ],
    },
  ];

  for (const vData of sampleVendorsData) {
    const category = await prisma.category.findUnique({
      where: { slug: vData.categorySlug },
    });

    if (!category) continue;

    const vendorPasswordHash = await argon2.hash('VendorSecure#2026', {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const owner = await prisma.user.upsert({
      where: { email: vData.ownerEmail },
      update: {},
      create: {
        fullName: vData.ownerName,
        email: vData.ownerEmail,
        phone: vData.phone,
        passwordHash: vendorPasswordHash,
        role: 'VENDOR',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    });

    const vendor = await prisma.vendor.upsert({
      where: { slug: vData.slug },
      update: {
        startingPrice: vData.startingPrice,
        approvalStatus: vData.approvalStatus,
        verificationStatus: vData.verificationStatus,
      },
      create: {
        ownerUserId: owner.id,
        businessName: vData.businessName,
        slug: vData.slug,
        categoryId: category.id,
        description: vData.description,
        startingPrice: vData.startingPrice,
        currency: 'INR',
        address: vData.address,
        city: vData.city,
        district: vData.district,
        state: 'Tamil Nadu',
        postalCode: vData.postalCode,
        phone: vData.phone,
        whatsappPhone: vData.whatsappPhone,
        latitude: vData.latitude,
        longitude: vData.longitude,
        approvalStatus: vData.approvalStatus,
        verificationStatus: vData.verificationStatus,
        approvedAt: new Date(),
      },
    });

    // Add images
    for (let i = 0; i < vData.images.length; i++) {
      const imgUrl = vData.images[i];
      const existingImg = await prisma.vendorImage.findFirst({
        where: { vendorId: vendor.id, imageUrl: imgUrl },
      });
      if (!existingImg) {
        await prisma.vendorImage.create({
          data: {
            vendorId: vendor.id,
            imageUrl: imgUrl,
            storageKey: `sample/${vendor.id}/${i}`,
            altText: `${vendor.businessName} photo ${i + 1}`,
            sortOrder: i,
          },
        });
      }
    }

    // Add packages
    for (const pkg of vData.packages) {
      const existingPkg = await prisma.servicePackage.findFirst({
        where: { vendorId: vendor.id, name: pkg.name },
      });
      if (!existingPkg) {
        await prisma.servicePackage.create({
          data: {
            vendorId: vendor.id,
            name: pkg.name,
            description: pkg.description,
            price: pkg.price,
            currency: 'INR',
            inclusions: pkg.inclusions,
            isActive: true,
          },
        });
      }
    }

    // Seed sample review from customer
    const existingReview = await prisma.review.findUnique({
      where: {
        vendorId_customerUserId: {
          vendorId: vendor.id,
          customerUserId: customer.id,
        },
      },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          vendorId: vendor.id,
          customerUserId: customer.id,
          rating: 5,
          comment: `Outstanding service for our family wedding in Madurai! Very professional and dependable team. Highly recommended for couples planning their big day.`,
          moderationStatus: 'APPROVED',
        },
      });
    }
  }

  console.log('✅ Seed completed successfully with Madurai wedding vendors, packages & verified reviews!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
