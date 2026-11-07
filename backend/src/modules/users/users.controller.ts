import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class UsersController {
  static async saveVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const saved = await UsersService.saveVendor(req.user!.userId, req.params.vendorId);
      return sendCreated(res, saved, 'Vendor saved to wishlist');
    } catch (error) {
      next(error);
    }
  }

  static async unsaveVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UsersService.unsaveVendor(req.user!.userId, req.params.vendorId);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getSavedVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const saved = await UsersService.getSavedVendors(req.user!.userId);
      return sendSuccess(res, saved);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UsersService.updateProfile(req.user!.userId, req.body);
      return sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
