import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { authenticateJwt } from '../../middleware/auth';
import { requireRole } from '../../middleware/rbac';
import { validateBody } from '../../middleware/validate';
import { createCategorySchema, updateCategorySchema, ROLES } from '@vizhaspace/shared';

const router = Router();

// Public endpoints
router.get('/', CategoriesController.getAllCategories);
router.get('/:slug', CategoriesController.getCategoryBySlug);

// Admin endpoints
router.post(
  '/',
  authenticateJwt,
  requireRole(ROLES.ADMIN),
  validateBody(createCategorySchema),
  CategoriesController.createCategory
);

router.patch(
  '/:id',
  authenticateJwt,
  requireRole(ROLES.ADMIN),
  validateBody(updateCategorySchema),
  CategoriesController.updateCategory
);

router.delete(
  '/:id',
  authenticateJwt,
  requireRole(ROLES.ADMIN),
  CategoriesController.deleteCategory
);

export const categoriesRouter = router;
