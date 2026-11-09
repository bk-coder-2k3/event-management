import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ForbiddenError } from '../utils/errors';

const STATE_CHANGING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function csrfProtection(req: Request, _res: Response, next: NextFunction) {
  // Only apply to state changing requests
  if (!STATE_CHANGING_METHODS.includes(req.method)) {
    return next();
  }

  // Skip in test environment
  if (env.NODE_ENV === 'test') {
    return next();
  }

  // If request contains Bearer token in Authorization header, it's not vulnerable to typical ambient-credential CSRF
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const allowedOrigins = [
    env.CLIENT_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'https://vizhaspace.in',
    'https://www.vizhaspace.in',
    'https://vendor.vizhaspace.in',
    'https://partners.vizhaspace.in',
    'https://admin.vizhaspace.in',
    'https://kalyanaconnect.com',
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return next(new ForbiddenError('Invalid origin for state-changing request'));
  }

  if (!origin && referer) {
    const isAllowedReferer = allowedOrigins.some((allowed) => referer.startsWith(allowed));
    if (!isAllowedReferer) {
      return next(new ForbiddenError('Invalid referer header'));
    }
  }

  next();
}
