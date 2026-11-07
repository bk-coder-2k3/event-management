import { Router } from 'express';
import multer from 'multer';
import { VendorsController } from './vendors.controller';
import { authenticateJwt, optionalAuth } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody, validateQuery } from '../../middleware/validate';
import {
  createVendorSchema,
  updateVendorSchema,
  vendorQuerySchema,
  ROLES,
} from '@kalyanaconnect/shared';
import { BadRequestError } from '../../utils/errors';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only JPEG, PNG and WEBP images are allowed'));
    }
  },
});

const router = Router();

// Public vendor search & listing
router.get('/', validateQuery(vendorQuerySchema), VendorsController.getPublicVendors);

// Vendor me profile (must be defined before /:slug so "me" is not matched as slug)
router.get('/me', authenticateJwt, requireRole(ROLES.VENDOR, ROLES.ADMIN), VendorsController.getVendorMe);

// Public vendor detail page by slug (with optional auth to allow owners to preview pending status)
router.get('/:slug', optionalAuth, VendorsController.getVendorBySlug);

// Create vendor profile (Vendor role only)
router.post(
  '/',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  validateBody(createVendorSchema),
  VendorsController.createVendor
);

// Update vendor profile
router.patch(
  '/:id',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  validateBody(updateVendorSchema),
  VendorsController.updateVendor
);

// Image portfolio upload
router.post(
  '/:id/images',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  upload.single('image'),
  VendorsController.addImage
);

// Delete image
router.delete(
  '/:id/images/:imageId',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  VendorsController.deleteImage
);

import { PackagesController } from '../packages/packages.controller';
import {
  createPackageSchema,
  updatePackageSchema,
} from '@kalyanaconnect/shared';

// Packages management
router.post(
  '/:id/packages',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  validateBody(createPackageSchema),
  PackagesController.createPackage
);

router.patch(
  '/:id/packages/:packageId',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  validateBody(updatePackageSchema),
  PackagesController.updatePackage
);

router.delete(
  '/:id/packages/:packageId',
  authenticateJwt,
  requireRole(ROLES.VENDOR, ROLES.ADMIN),
  PackagesController.deletePackage
);

export const vendorsRouter = router;
