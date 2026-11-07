# KalyanaConnect Security Architecture & Checklist

## 1. Authentication & Token Management
- [x] **Argon2id Hashing:** Password hashing uses Argon2id with 64MB memory cost, 3 iterations, and 1 parallelism thread. Plain passwords are never logged or stored.
- [x] **Short-lived Access Tokens:** JWT access tokens expire after 15 minutes.
- [x] **Rotating Refresh Tokens:** Stored in HttpOnly, Secure, SameSite cookies in production (`maxAge: 7 days`).
- [x] **Token Hash Storage:** Raw refresh tokens are never stored in PostgreSQL. Only cryptographic SHA-256 hashes are persisted in the `RefreshSession` table.
- [x] **Token Reuse Detection:** If an already-replaced or revoked session is presented, all refresh sessions for that user account are revoked immediately as potential theft detection.
- [x] **Frontend Storage:** Tokens are stored strictly in memory within the React `AuthContext`, never in `localStorage` or `sessionStorage`.

## 2. Authorization & Anti-Privilege Escalation
- [x] **Role-Based Access Control (RBAC):** Backend Express middleware (`requireRole`) verifies `CUSTOMER`, `VENDOR`, or `ADMIN`.
- [x] **No Public Admin Registration:** The registration endpoint strictly rejects `ADMIN` in the request payload and defaults exclusively to `CUSTOMER` or `VENDOR`.
- [x] **Controlled Admin Bootstrap:** Secure CLI script (`npm run bootstrap:admin`) creates or elevates initial administrators using system environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
- [x] **Ownership Isolation:** Vendors can only view and mutate their own packages, photos, and addressed enquiries. Customers can only view their own enquiries and wishlist.
- [x] **Input Sanitization:** Vendor profile update endpoints strip sensitive administrative fields (`approvalStatus`, `verificationStatus`, `rejectionReason`).

## 3. Network & Transport Security
- [x] **CORS Allowlist:** Explicit origin validation for `CLIENT_ORIGIN` (`http://localhost:3000` / production domain).
- [x] **CSRF Mitigation:** Origin and Referer validation for cookie-authenticated state-changing operations (`POST`, `PUT`, `PATCH`, `DELETE`).
- [x] **Security Headers:** `helmet` configured with strict cross-origin policies.
- [x] **Rate Limiting:**
  - `authLimiter`: 20 requests per 15 minutes on login, registration, and password recovery.
  - `enquiryLimiter`: 30 requests per hour on enquiry submissions to prevent spam.
  - `generalLimiter`: 500 requests per 15 minutes across general API routes.

## 4. Sensitive Operations & Audit Trail
- [x] **Audit Logging:** Every administrative action (`VENDOR_APPROVED`, `VENDOR_REJECTED`, `VENDOR_VERIFIED`, `USER_STATUS_SUSPENDED`) records admin ID, IP address, user agent, and before/after details in the `AuditLog` table.
- [x] **Account Suspension:** When an admin suspends or disables a user, all active refresh sessions are revoked instantly in the database.
- [x] **Review Integrity:** Database-level unique constraint (`@@unique([vendorId, customerUserId])`) prevents review duplication or review manipulation.
