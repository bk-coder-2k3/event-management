# KalyanaConnect Deployment Guide

## 1. Environment Topology

- **Frontend:** Next.js (App Router) deployed to Vercel, Cloudflare Pages, or a Node.js VPS host.
- **Backend:** Express API deployed to a Linux VPS (Ubuntu 22.04/24.04), AWS ECS, Render, or Docker container.
- **Database:** Managed PostgreSQL (AWS RDS, Neon, Supabase, or self-hosted PostgreSQL 16 on VPS).
- **Storage:** Local storage provider with static serving or Cloudinary object storage.

---

## 2. Docker Compose Deployment

The repository includes a ready-to-run `docker-compose.yml` for PostgreSQL:

```bash
# Start PostgreSQL container
docker compose up -d

# Check health
docker compose ps
```

---

## 3. Production Environment Variables

### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=production
API_PREFIX=/api/v1
CLIENT_ORIGIN=https://kalyanaconnect.com
DATABASE_URL=postgresql://user:password@db-host:5432/kalyanaconnect?sslmode=require
JWT_ACCESS_SECRET=your_production_64char_random_secret_here
JWT_REFRESH_SECRET=your_production_64char_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_production_cookie_secret_here

STORAGE_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ADMIN_EMAIL=superadmin@kalyanaconnect.com
ADMIN_PASSWORD=ProductionSuperSecurePass#2026
ADMIN_NAME="Platform Super Administrator"
```

### Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=https://api.kalyanaconnect.com/api/v1
```

---

## 4. Production Build & Start Commands

```bash
# 1. Build shared library
npm run build:shared

# 2. Build backend
npm run build:backend

# 3. Build Next.js frontend
npm run build:frontend

# 4. Apply database migrations
npm run db:migrate --workspace=backend

# 5. Bootstrap initial administrator
npm run bootstrap:admin --workspace=backend

# 6. Start servers
# In backend:
npm run start --workspace=backend

# In frontend:
npm run start --workspace=frontend
```

---

## 5. Health & Readiness Probes

- Liveness check: `GET /health` -> `200 OK` (`{ status: "ok" }`)
- Readiness check (verifies database ping): `GET /ready` -> `200 OK` (`{ status: "ready", database: "connected" }`)
