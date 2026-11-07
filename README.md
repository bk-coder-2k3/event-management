# KalyanaConnect — Production-Ready Wedding Vendor Marketplace

> **"Find Your Perfect Wedding Team."**  
> A full-stack, responsive wedding services marketplace designed for Tamil Nadu, India (starting with Madurai and architected for expansion to Theni, Coimbatore, Chennai, and all 38 districts).

---

## 🌟 Highlights & Architecture

KalyanaConnect provides a high-trust digital marketplace connecting couples with verified wedding professionals (Kalyana Mandapams, candid muhurtham photographers, authentic banana-leaf caterers, stage decorators, Nadaswaram troupes, and bridal stylists).

### Individual Sub-Portals & Isolation:
- **Public Marketplace (`/`, `/vendors`, `/vendors/[slug]`, `/categories/[slug]`):** Warm ivory, burgundy, and champagne-gold aesthetic with district-level database filtering, price sorting, package breakdowns, and verified reviews.
- **Customer Portal (`/customer/*`):** Dedicated customer dashboard, enquiry tracker with real-time status badges, wishlist bookmarks, and personal profile manager.
- **Vendor Partner Portal (`/vendor/*`):** Dedicated vendor layout with business approval state banner, service package editor, high-resolution photo gallery upload, and enquiry inbox with one-click WhatsApp client replies.
- **Admin Control Center (`/admin/*`):** Executive dark burgundy console featuring real-time KPI metrics, pending vendor review queue with mandatory rejection rationale, verification badge toggling, user account suspension, category manager, review moderation, and security audit logs.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript (Strict), Tailwind CSS, Lucide Icons, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, TypeScript, REST API (`/api/v1`), Zod validation, Helmet, CORS allowlist, Express Rate Limit, Pino structured logging |
| **Database** | PostgreSQL, Prisma ORM, versioned migrations, Decimal types for monetary amounts, unique constraints, and audit logs |
| **Authentication** | JWT access tokens (15m in memory), rotating refresh tokens (7d) in HttpOnly cookies, SHA-256 token hashes in DB, session reuse detection, Argon2id password hashing |
| **Storage** | Pluggable storage abstraction (`LocalStorageService` with local static serving fallback + `CloudinaryStorageService`) |

---

## 📂 Monorepo Structure

```
KalyanaConnect/
├── shared/                       # Shared TypeScript types, Zod schemas, & constants
│   ├── src/constants/            # Roles, enquiry statuses, Tamil Nadu districts
│   ├── src/types/                # User, Vendor, Package, Enquiry, Review interfaces
│   └── src/validators/           # Shared Zod validation schemas
├── backend/                      # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma         # Normalized PostgreSQL schema
│   │   └── seed.ts               # Madurai wedding categories & demo data
│   ├── src/
│   │   ├── config/               # Environment, database, logger, CORS
│   │   ├── middleware/           # Auth, RBAC, CSRF, rate limiters, error handler
│   │   ├── modules/              # Auth, vendors, categories, packages, enquiries, reviews, admin
│   │   ├── services/             # Storage, Token, Password (Argon2id), Audit log
│   │   ├── bootstrap-admin.ts    # Controlled CLI admin bootstrap
│   │   └── app.ts / server.ts    # Express application setup
│   └── tests/                    # Jest automated test suites
├── frontend/                     # Next.js 15 App Router application
│   ├── src/
│   │   ├── app/                  # Public routes, /customer/*, /vendor/*, /admin/*
│   │   ├── components/           # UI primitives, layout navbar/footer, marketplace cards
│   │   ├── features/auth/        # AuthContext and useAuth hook
│   │   └── lib/api-client.ts     # Typed API client with auto-refresh & cookie handling
├── docs/                         # Architecture, API specifications, and security checklist
├── docker-compose.yml            # PostgreSQL 16 container setup
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js:** `v20+` or `v24+`
- **npm:** `v10+` or `v11+`
- **PostgreSQL:** Running locally on port `5432` or via Docker Compose.

### 2. Start PostgreSQL (Docker option)
```bash
docker compose up -d
```

### 3. Install Dependencies & Build Shared Library
```bash
# In root directory:
npm run build:shared
```

### 4. Setup Database & Seed Initial Categories
```bash
# Generate Prisma Client:
npm run prisma:generate --workspace=backend

# Push schema to PostgreSQL:
npm run db:push --workspace=backend

# Seed Tamil Nadu categories, Madurai sample vendors, and initial reviews:
npm run db:seed --workspace=backend
```

### 5. Secure Admin Bootstrap
```bash
# Elevates or creates initial platform administrator:
npm run bootstrap:admin --workspace=backend
```
*Default bootstrap credentials (configurable in `.env`):*
- **Email:** `admin@kalyanaconnect.com`
- **Password:** `AdminSecure#2026`

### 6. Run Development Servers
```bash
# Run both Backend (Port 5000) and Frontend (Port 3000) concurrently:
npm run dev
```
- **Frontend URL:** `http://localhost:3000`
- **Backend API URL:** `http://localhost:5000/api/v1`
- **Health Check:** `http://localhost:5000/health`
- **Database Readiness:** `http://localhost:5000/ready`

---

## 🧪 Automated Testing

Run the automated test suite covering Argon2id password security, JWT & refresh token reuse detection, RBAC privilege protection, vendor approval workflows, and enquiry validations:

```bash
npm run test:backend
```

**Test Verification Summary:**
```
PASS tests/vendor.test.ts
PASS tests/security.test.ts
PASS tests/auth.test.ts
PASS tests/enquiry.test.ts

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
Snapshots:   0 total
```

---

## 🔒 Security Architecture Highlights

1. **No Admin Self-Registration:** Registration endpoint explicitly rejects the `ADMIN` role.
2. **Rotating Refresh Tokens:** Rotated on every use. Detection of replaced session hashes triggers instant user-wide session revocation.
3. **Argon2id Passwords:** High memory & time cost resistant to GPU cracking.
4. **Isolated Dashboards:** Frontend `AuthGuard` paired with backend Express `requireRole` middleware.
5. **Audit Logging:** Destructive or privileged actions (suspensions, vendor approvals, rejections) are saved to the `AuditLog` table with remote IP and user agent.
