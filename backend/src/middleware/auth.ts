import { Request, Response, NextFunction } from 'express';
import { TokenService, AccessTokenPayload } from '../services/tokenService';
import { UnauthorizedError } from '../utils/errors';
import { prisma } from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload & {
        status: string;
      };
    }
  }
}

export async function authenticateJwt(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const payload = TokenService.verifyAccessToken(token);

    // Verify user exists and status is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedError('User account not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedError(`Account is ${user.status.toLowerCase()}`);
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role as any,
      status: user.status,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Access token has expired', { code: 'TOKEN_EXPIRED' }));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid access token'));
    }
    next(error);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = TokenService.verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true, status: true },
      });
      if (user && user.status === 'ACTIVE') {
        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role as any,
          status: user.status,
        };
      }
    }
  } catch {
    // Silently ignore invalid/expired token for optional auth
  }
  next();
}
