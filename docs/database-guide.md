# KalyanaConnect Database Architecture & Operations Guide

## 1. Normalized Schema Overview

The database is built on PostgreSQL with Prisma ORM.

### Models & Cardinalities:
- `User`: Base identity entity with `CUSTOMER`, `VENDOR`, and `ADMIN` roles.
- `Category`: Wedding service categories (e.g. venues, photography, catering, decoration).
- `Vendor`: Business profile (1-to-1 with User owner, many-to-1 with Category).
- `VendorImage`: Portfolio photographs (many-to-1 with Vendor, with `sortOrder`).
- `ServicePackage`: Standard pricing tiers and inclusion arrays (many-to-1 with Vendor).
- `Enquiry`: Customer wedding quote requests (many-to-1 with Vendor, optional 1-to-many with Customer).
- `Review`: Verified feedback with 1-5 rating (unique constraint on `[vendorId, customerUserId]`).
- `SavedVendor`: Customer wishlist (unique constraint on `[customerUserId, vendorId]`).
- `RefreshSession`: Cryptographically hashed active refresh token sessions.
- `AuditLog`: Administrative compliance journal.

### Monetary Values:
All monetary fields (`startingPrice`, `price`, `budgetMin`, `budgetMax`) use PostgreSQL `Decimal(12, 2)` to eliminate floating-point precision errors.

---

## 2. Key Indexes

- `Vendor`:
  - `@@index([slug])`
  - `@@index([district])`
  - `@@index([city])`
  - `@@index([approvalStatus])`
  - `@@index([categoryId])`
  - `@@index([startingPrice])`
- `Enquiry`:
  - `@@index([vendorId])`
  - `@@index([customerUserId])`
  - `@@index([status])`
  - `@@index([createdAt])`
- `Review`:
  - `@@index([vendorId])`
  - `@@index([moderationStatus])`
- `RefreshSession`:
  - `@@index([userId])`
  - `@@index([tokenHash])`

---

## 3. Database Migrations & Commands

### Generate Prisma Client:
```bash
npm run prisma:generate --workspace=backend
```

### Apply Migrations in Production:
```bash
npm run db:migrate --workspace=backend
```

### Development Push:
```bash
npm run db:push --workspace=backend
```

### Seed Tamil Nadu Categories & Demo Data:
```bash
npm run db:seed --workspace=backend
```

---

## 4. Database Backup & Disaster Recovery

### Manual Backup (pg_dump):
```bash
pg_dump -h localhost -U postgres -d kalyanaconnect -F c -b -v -f ./backups/kalyanaconnect_$(date +%Y%m%d_%H%M%S).dump
```

### Automated Nightly Cron (Linux VPS):
```bash
0 2 * * * pg_dump -h localhost -U postgres -d kalyanaconnect -F c | gzip > /var/backups/kalyanaconnect/db_$(date +\%F).dump.gz
```

### Database Restore (pg_restore):
```bash
pg_restore -h localhost -U postgres -d kalyanaconnect -v ./backups/kalyanaconnect_backup.dump
```
