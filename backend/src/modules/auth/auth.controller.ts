import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendCreated, sendSuccess } from '../../utils/apiResponse';
import { env } from '../../config/env';

const REFRESH_COOKIE_NAME = 'kalyana_refresh_token';

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);

      // Set rotating refresh token in HttpOnly cookie
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      return sendCreated(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Registration successful'
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      return sendSuccess(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Login successful'
      );
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
      const result = await AuthService.refreshToken(rawRefreshToken);

      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, cookieOptions);

      return sendSuccess(
        res,
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Token refreshed successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies[REFRESH_COOKIE_NAME] || req.body.refreshToken;
      await AuthService.logout(rawRefreshToken);

      res.clearCookie(REFRESH_COOKIE_NAME, {
        ...cookieOptions,
        maxAge: 0,
      });

      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body.token, req.body.newPassword);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.verifyEmail(req.body.token);
      return sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
