import { Router } from 'express';
import { ReviewsController } from './reviews.controller';
import { authenticateJwt } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody } from '../../middleware/validate';
import { createReviewSchema, moderateReviewSchema, ROLES } from '@vizhaspace/shared';

const router = Router();

// Public: get approved vendor reviews
router.get('/vendor/:vendorId', ReviewsController.getVendorReviews);

// Customer: submit review
router.post(
  '/',
  authenticateJwt,
  requireRole(ROLES.CUSTOMER),
  validateBody(createReviewSchema),
  ReviewsController.createReview
);

// Admin: moderate review
router.patch(
  '/:id/moderate',
  authenticateJwt,
  requireRole(ROLES.ADMIN),
  validateBody(moderateReviewSchema),
  ReviewsController.moderateReview
);

export const reviewsRouter = router;
