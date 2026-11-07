import { Request, Response, NextFunction } from 'express';
import { CategoriesService } from './categories.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class CategoriesController {
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await CategoriesService.getAllCategories(includeInactive);
      return sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoriesService.getCategoryBySlug(req.params.slug);
      return sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoriesService.createCategory(req.body);
      return sendCreated(res, category, 'Category created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoriesService.updateCategory(req.params.id, req.body);
      return sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoriesService.deleteCategory(req.params.id);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
