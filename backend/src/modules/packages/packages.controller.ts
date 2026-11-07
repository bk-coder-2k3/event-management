import { Request, Response, NextFunction } from 'express';
import { PackagesService } from './packages.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class PackagesController {
  static async createPackage(req: Request, res: Response, next: NextFunction) {
    try {
      const pkg = await PackagesService.createPackage(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      return sendCreated(res, pkg, 'Package created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updatePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const pkg = await PackagesService.updatePackage(
        req.params.id,
        req.params.packageId,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      return sendSuccess(res, pkg, 'Package updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deletePackage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PackagesService.deletePackage(
        req.params.id,
        req.params.packageId,
        req.user!.userId,
        req.user!.role
      );
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
