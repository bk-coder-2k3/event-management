# KalyanaConnect API Specification (v1)

Version: `1.0.0`  
Base URL: `/api/v1`  
Protocol: HTTPS (in production)  
Authentication: JWT Bearer token in `Authorization: Bearer <token>` header, rotating Refresh Token in HttpOnly cookie `kalyana_refresh_token`.

---

## 1. Authentication Endpoints

### 1.1 Register Account
- **POST** `/auth/register`
- **Rate Limit:** 20 requests per 15 minutes
- **Body:**
  ```json
  {
    "fullName": "Priya Sundar",
    "email": "priya@example.com",
    "password": "SecurePassword#2026",
    "phone": "9842100000",
    "role": "CUSTOMER"
  }
  ```
  *(Note: `role` can only be `CUSTOMER` or `VENDOR`. Registration as `ADMIN` is rejected).*
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "uuid",
        "fullName": "Priya Sundar",
        "email": "priya@example.com",
        "role": "CUSTOMER",
        "status": "ACTIVE"
      },
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

### 1.2 Login
- **POST** `/auth/login`
- **Rate Limit:** 20 requests per 15 minutes
- **Body:**
  ```json
  {
    "email": "priya@example.com",
    "password": "SecurePassword#2026"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "accessToken": "eyJhbGci..."
    }
  }
  ```
  *(Sets `kalyana_refresh_token` in `HttpOnly, Secure, SameSite=Lax/None` cookie).*

### 1.3 Refresh Access Token
- **POST** `/auth/refresh`
- **Cookie:** `kalyana_refresh_token=<token>`
- **Behavior:** Verifies hash in database. Rotates session, detects reuse, and issues new access token.
- **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "user": { ... },
      "accessToken": "eyJhbGci..."
    }
  }
  ```

### 1.4 Logout
- **POST** `/auth/logout`
- **Behavior:** Revokes active refresh session in database, clears cookie.

### 1.5 Get Current User Profile
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <access_token>`
- **Response (200):** Returns authenticated user with vendor profile details if user is a vendor.

### 1.6 Forgot Password
- **POST** `/auth/forgot-password`
- **Body:** `{ "email": "priya@example.com" }`

### 1.7 Reset Password
- **POST** `/auth/reset-password`
- **Body:** `{ "token": "<raw_reset_token>", "newPassword": "NewSecure#2026" }`

---

## 2. Vendor Marketplace Endpoints

### 2.1 Public Search Directory
- **GET** `/vendors`
- **Query Parameters:**
  - `district` (e.g. `Madurai`, `Theni`, `Coimbatore`)
  - `category` (slug or UUID)
  - `search` (keyword in name, description, city)
  - `minPrice` (numeric)
  - `maxPrice` (numeric)
  - `sortBy` (`relevance`, `price_asc`, `price_desc`, `rating`, `newest`)
  - `page` (default 1)
  - `limit` (default 12, max 50)
- **Response (200):** Only returns vendors with `approvalStatus: APPROVED`.

### 2.2 Get Vendor Detail by Slug
- **GET** `/vendors/:slug`
- **Response (200):** Vendor profile, categorized service packages, portfolio images, and approved customer reviews.

### 2.3 Create Vendor Profile
- **POST** `/vendors`
- **Role:** `VENDOR`
- **Body:**
  ```json
  {
    "businessName": "Sri Meenakshi Kalyana Mandapam",
    "categoryId": "uuid",
    "description": "Grand AC marriage hall in Madurai...",
    "startingPrice": 150000,
    "address": "42 West Veli Street",
    "city": "Madurai",
    "district": "Madurai",
    "postalCode": "625001",
    "whatsappPhone": "9842112345"
  }
  ```

### 2.4 Update Vendor Profile
- **PATCH** `/vendors/:id`
- **Role:** `VENDOR` (owner only) or `ADMIN`
- **Protection:** Sanitizes input to prevent setting `approvalStatus` or `verificationStatus`.

### 2.5 Upload Portfolio Image
- **POST** `/vendors/:id/images`
- **Role:** `VENDOR` (owner only) or `ADMIN`
- **Form Data:** `image` (binary, max 5MB, jpeg/png/webp)

### 2.6 Delete Portfolio Image
- **DELETE** `/vendors/:id/images/:imageId`

---

## 3. Service Package Endpoints

- **POST** `/vendors/:id/packages`: Create service package
- **PATCH** `/vendors/:id/packages/:packageId`: Update package details/pricing
- **DELETE** `/vendors/:id/packages/:packageId`: Remove package

---

## 4. Enquiry Endpoints

### 4.1 Submit Enquiry
- **POST** `/enquiries`
- **Rate Limit:** 30 requests per hour
- **Body:**
  ```json
  {
    "vendorId": "uuid",
    "customerName": "Karthik Subramanian",
    "customerEmail": "karthik@example.com",
    "customerPhone": "9842100001",
    "eventDate": "2026-11-20",
    "eventCity": "Madurai",
    "budgetMin": 80000,
    "budgetMax": 150000,
    "requirements": "Need full muhurtham flower decoration..."
  }
  ```

### 4.2 Customer Enquiry History
- **GET** `/enquiries/customer`
- **Role:** `CUSTOMER`

### 4.3 Vendor Enquiry Inbox
- **GET** `/enquiries/vendor`
- **Role:** `VENDOR`

### 4.4 Update Enquiry Status
- **PATCH** `/enquiries/:id/status`
- **Role:** `VENDOR` (addressed vendor only) or `ADMIN`
- **Body:** `{ "status": "CONTACTED" | "QUOTED" | "ACCEPTED" | "DECLINED" | "CLOSED" }`

---

## 5. Review Endpoints

- **POST** `/reviews`: Submit 1-5 star review and comment (Customer role only, 1 review per vendor enforced).
- **GET** `/reviews/vendor/:vendorId`: Public list of approved reviews for a vendor.
- **PATCH** `/reviews/:id/moderate`: Admin approves or rejects review.

---

## 6. Admin Control Center Endpoints

- **GET** `/admin/stats`: Real-time platform KPI metrics and counts.
- **GET** `/admin/vendors`: Filterable list of all vendor applications.
- **PATCH** `/admin/vendors/:id/decision`: Approve or reject vendor (`rejectionReason` required on rejection).
- **PATCH** `/admin/vendors/:id/verify`: Toggle verified partner badge (`UNVERIFIED` / `VERIFIED`).
- **GET** `/admin/users`: List users with status & role filters.
- **PATCH** `/admin/users/:id/status`: Suspend, activate, or disable accounts (revokes all refresh sessions on suspension).
- **GET** `/admin/reviews`: List reviews requiring moderation.
- **GET** `/admin/audit-logs`: Security and administrative audit trail.
