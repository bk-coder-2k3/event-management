# VizhaSpace (vizhaspace.in) — Tamil Nadu All-Event & Wedding Marketplace

> **"Book Trusted Venues & Event Professionals Across Tamil Nadu."**  
> A full-stack, enterprise monorepo marketplace powering events, weddings, corporate functions, birthdays, and cultural gatherings across all 38 districts of Tamil Nadu.

---

## 🌟 Highlights & Architecture

VizhaSpace (`vizhaspace.in`) provides a verified digital ecosystem connecting families, planners, and corporate organizers with vetted event professionals (Kalyana Mandapams, banquet halls, mini-halls, photographers, caterers, stage decorators, audio-lighting specialists, Nadaswaram troupes, makeup stylists, DJ & MCs, and event coordinators).

### Multi-App Architecture:
- **Customer Marketplace (`apps/customer` - `http://localhost:3000` / `https://vizhaspace.in`):**
  - Warm ivory, burgundy, and champagne-gold theme.
  - Event-type filtering (Weddings, Receptions, Betrothals, Birthdays, Corporate, Baby Showers, Housewarmings, etc.).
  - Tamil Nadu district filtering (Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli, and all 38 districts).
  - Category-specific technical specifications (AC/Non-AC dining capacity, muhurtham rooms, drone coverage, veg/non-veg buffet, sound decibel limits).
  - Enquiry modals with pre-formatted WhatsApp direct contact.
  - Customer wishlist & enquiry management.

- **Vendor Partner Portal (`apps/vendor` - `http://localhost:3001` / `https://vendor.vizhaspace.in`):**
  - Vendor onboarding & profile management with category-specific configurations.
  - Dynamic packages builder with pricing and deliverables.
  - Photo gallery upload with category tagging.
  - Lead & enquiry tracking with one-click WhatsApp client follow-up.
  - Verification & review badge status.

- **Admin Control Center (`apps/admin` - `http://localhost:3002` / `https://admin.vizhaspace.in`):**
  - Executive control center with real-time analytics.
  - Vendor onboarding approval queue with mandatory rejection rationale.
  - Category manager with custom attributes & pricing units.
  - Review moderation and user account management.
  - Security audit logs with IP & User-Agent capture.

- **Backend API (`backend` - `http://localhost:5000/api/v1`):**
  - High-performance Express.js REST API with Prisma ORM.
  - Argon2id password security with brute-force rate limiting.
  - Rotating refresh token security with instant session revocation on reuse.
  - RBAC authorization (`CUSTOMER`, `VENDOR`, `ADMIN`).
  - Strict CORS allowlist supporting `vizhaspace.in` subdomains.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Monorepo** | npm Workspaces (`@vizhaspace/shared`, `@vizhaspace/backend`, `@vizhaspace/customer`, `@vizhaspace/vendor`, `@vizhaspace/admin`) |
| **Frontend Apps** | Next.js 15 (App Router), React 19, TypeScript (Strict), Tailwind CSS, Lucide Icons |
| **Backend API** | Node.js, Express.js, TypeScript, REST API (`/api/v1`), Zod validation, Helmet, CORS, Express Rate Limit, Pino logger |
| **Database** | PostgreSQL (Supabase / Local), Prisma ORM, migrations & seeds |
| **Authentication** | JWT access tokens (15m in memory), rotating refresh tokens (7d) in HttpOnly cookies, SHA-256 hash checks, Argon2id passwords |
| **Storage** | Local disk storage fallback + Cloudinary integration |

---

## 📂 Monorepo Structure

```
KalyanaConnect/
├── apps/
│   ├── customer/                 # Next.js 15 customer marketplace (vizhaspace.in)
│   ├── vendor/                   # Next.js 15 vendor portal (vendor.vizhaspace.in)
│   └── admin/                    # Next.js 15 admin center (admin.vizhaspace.in)
├── backend/                      # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma         # PostgreSQL schema
│   │   └── seed.ts               # Event categories, admin & sample vendors
│   ├── src/                      # Controllers, routes, middleware, services
│   └── tests/                    # Jest automated test suites
├── shared/                       # Shared TypeScript types, Zod schemas, & constants
├── docker-compose.yml            # Local PostgreSQL 16 container setup
└── package.json                  # Root monorepo scripts & dependencies
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies & Build Shared Library
```bash
npm install
npm run build:shared
```

### 2. Setup Database & Seed
```bash
# Push schema to PostgreSQL (Supabase or local):
npm run db:push --workspace=backend

# Seed Tamil Nadu event categories, admin credentials, and sample vendors:
npm run db:seed --workspace=backend
```

*Default Admin Credentials:*
- **Email:** `admin@vizhaspace.in`
- **Password:** `AdminSecure#2026`

### 3. Run Development Servers
```bash
# Start all services concurrently:
npm run dev

# Or start specific services:
npm run dev:backend   # Port 5000
npm run dev:customer  # Port 3000
npm run dev:vendor    # Port 3001
npm run dev:admin     # Port 3002
```

### 4. Build All Services for Production
```bash
npm run build
```

---

## 🧪 Automated Testing

```bash
npm run test:backend
```
*17/17 automated test suites passing.*
