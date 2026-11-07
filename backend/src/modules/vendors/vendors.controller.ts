import { Request, Response, NextFunction } from 'express';
import { VendorsService } from './vendors.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';
import { BadRequestError } from '../../utils/errors';

export class VendorsController {
  static async createVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await VendorsService.createVendor(req.user!.userId, req.body);
      return sendCreated(res, vendor, 'Vendor profile submitted successfully. Pending administrative approval.');
    } catch (error) {
      next(error);
    }
  }

  static async getPublicVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VendorsService.getPublicVendors(req.query as any);
      return sendSuccess(res, result.vendors, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await VendorsService.getVendorBySlug(
        req.params.slug,
        req.user ? { userId: req.user.userId, role: req.user.role } : undefined
      );
      return sendSuccess(res, vendor);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorMe(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await VendorsService.getVendorMe(req.user!.userId);
      return sendSuccess(res, vendor);
    } catch (error) {
      next(error);
    }
  }

  static async updateVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await VendorsService.updateVendor(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      return sendSuccess(res, vendor, 'Vendor profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new BadRequestError('No image file provided');
      }
      const image = await VendorsService.addImage(
        req.params.id,
        req.user!.userId,
        req.user!.role,
        req.file,
        req.body.altText
      );
      return sendCreated(res, image, 'Image uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await VendorsService.deleteImage(
        req.params.id,
        req.params.imageId,
        req.user!.userId,
        req.user!.role
      );
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
