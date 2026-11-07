import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // 1. Known AppError instances
  if (err instanceof AppError) {
    logger.warn(
      {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        code: err.code,
        message: err.message,
        details: err.details,
      },
      'Application Error'
    );

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // 2. Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      return res.status(409).json({
        success: false,
        error: {
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
          message: `A record with this ${target.join(', ')} already exists`,
        },
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'RECORD_NOT_FOUND',
          message: 'Requested record was not found',
        },
      });
    }
  }

  // 3. Fallback unhandled server errors
  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
    },
    'Unhandled Server Error'
  );

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal error occurred. Please try again later.',
      ...(env.NODE_ENV !== 'production' ? { stack: err.stack, details: err.message } : {}),
    },
  });
}
