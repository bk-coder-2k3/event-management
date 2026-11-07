import { Request, Response, NextFunction } from 'express';
import { ReviewsService } from './reviews.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';

export class ReviewsController {
  static async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewsService.createReview(req.user!.userId, req.body);
      return sendCreated(res, review, 'Review submitted successfully. It will appear publicly upon moderation.');
    } catch (error) {
      next(error);
    }
  }

  static async getVendorReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewsService.getVendorReviews(req.params.vendorId);
      return sendSuccess(res, reviews);
    } catch (error) {
      next(error);
    }
  }

  static async moderateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewsService.moderateReview(req.params.id, req.body.moderationStatus);
      return sendSuccess(res, review, `Review marked as ${req.body.moderationStatus}`);
    } catch (error) {
      next(error);
    }
  }
}
