import { Router } from 'express';
import { UsersController } from './users.controller';
import { authenticateJwt } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { ROLES } from '@kalyanaconnect/shared';

const router = Router();

router.use(authenticateJwt);

// Customer saved vendors
router.get('/saved-vendors', requireRole(ROLES.CUSTOMER, ROLES.ADMIN), UsersController.getSavedVendors);
router.post('/saved-vendors/:vendorId', requireRole(ROLES.CUSTOMER, ROLES.ADMIN), UsersController.saveVendor);
router.delete('/saved-vendors/:vendorId', requireRole(ROLES.CUSTOMER, ROLES.ADMIN), UsersController.unsaveVendor);

// Profile
router.patch('/profile', UsersController.updateProfile);

export const usersRouter = router;
