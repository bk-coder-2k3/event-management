import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticateJwt } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody } from '../../middleware/validate';
import { adminVendorDecisionSchema, ROLES } from '@kalyanaconnect/shared';

const router = Router();

// Strictly protect all admin routes
router.use(authenticateJwt, requireRole(ROLES.ADMIN));

router.get('/stats', AdminController.getDashboardStats);
router.get('/vendors', AdminController.listVendors);
router.patch('/vendors/:id/decision', validateBody(adminVendorDecisionSchema), AdminController.decideVendor);
router.patch('/vendors/:id/verify', AdminController.setVendorVerification);
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/status', AdminController.setUserStatus);
router.get('/reviews', AdminController.listReviews);
router.get('/audit-logs', AdminController.listAuditLogs);

export const adminRouter = router;
