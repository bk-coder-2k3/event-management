import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { sendSuccess } from '../../utils/apiResponse';

export class AdminController {
  static async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboardStats();
      return sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async listVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listVendors(req.query as any);
      return sendSuccess(res, result.vendors, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async decideVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await AdminService.decideVendor(
        req.params.id,
        req.body,
        req.user!.userId,
        req
      );
      return sendSuccess(res, vendor, `Vendor status updated to ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  }

  static async setVendorVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = await AdminService.setVendorVerification(
        req.params.id,
        req.body.verificationStatus,
        req.user!.userId,
        req
      );
      return sendSuccess(res, vendor, `Vendor verification status set to ${req.body.verificationStatus}`);
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listUsers(req.query as any);
      return sendSuccess(res, result.users, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async setUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.setUserStatus(
        req.params.id,
        req.body.status,
        req.user!.userId,
        req
      );
      return sendSuccess(res, user, `User status updated to ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  }

  static async listReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listReviews(req.query as any);
      return sendSuccess(res, result.reviews, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async listAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.listAuditLogs(req.query as any);
      return sendSuccess(res, result.logs, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }
}
