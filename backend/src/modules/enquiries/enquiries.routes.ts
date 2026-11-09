import { Router } from 'express';
import { EnquiriesController } from './enquiries.controller';
import { authenticateJwt, optionalAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody } from '../../middleware/validate';
import {
  createEnquirySchema,
  updateEnquiryStatusSchema,
  ROLES,
} from '@vizhaspace/shared';
import { enquiryLimiter } from '../../middleware/rateLimiter';

const router = Router();

// Submit enquiry (supports logged-in customers or guests, rate limited)
router.post(
  '/',
  enquiryLimiter,
  optionalAuth,
  validateBody(createEnquirySchema),
  EnquiriesController.createEnquiry
);

// Customer enquiry history
router.get(
  '/customer',
  authenticateJwt,
  requireRole(ROLES.CUSTOMER, ROLES.ADMIN),
  EnquiriesController.getCustomerEnquiries
);

// Vendor enquiry inbox
router.get(
  '/vendor',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  EnquiriesController.getVendorEnquiries
);

// Vendor updates enquiry status
router.patch(
  '/:id/status',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  validateBody(updateEnquiryStatusSchema),
  EnquiriesController.updateEnquiryStatus
);

export const enquiriesRouter = router;
