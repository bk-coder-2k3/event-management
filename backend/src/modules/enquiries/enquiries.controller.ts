import { Request, Response, NextFunction } from 'express';
import { EnquiriesService } from './enquiries.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class EnquiriesController {
  static async createEnquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const customerUserId = req.user ? req.user.userId : null;
      const enquiry = await EnquiriesService.createEnquiry(req.body, customerUserId);
      return sendCreated(res, enquiry, 'Enquiry submitted successfully. The vendor will get in touch with you shortly.');
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiries = await EnquiriesService.getCustomerEnquiries(req.user!.userId);
      return sendSuccess(res, enquiries);
    } catch (error) {
      next(error);
    }
  }

  static async getVendorEnquiries(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiries = await EnquiriesService.getVendorEnquiries(req.user!.userId);
      return sendSuccess(res, enquiries);
    } catch (error) {
      next(error);
    }
  }

  static async updateEnquiryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const enquiry = await EnquiriesService.updateEnquiryStatus(
        req.params.id,
        req.body.status,
        req.user!.userId,
        req.user!.role
      );
      return sendSuccess(res, enquiry, 'Enquiry status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
