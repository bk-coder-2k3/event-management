import { Request } from 'express';
import { prisma } from '../config/db';
import { logger } from '../config/logger';

export interface AuditLogOptions {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
  req?: Request;
}

export class AuditService {
  static async log(options: AuditLogOptions): Promise<void> {
    try {
      const ipAddress =
        options.req?.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        options.req?.socket?.remoteAddress ||
        null;
      const userAgent = options.req?.headers['user-agent'] || null;

      await prisma.auditLog.create({
        data: {
          userId: options.userId,
          action: options.action,
          entityType: options.entityType,
          entityId: options.entityId,
          details: options.details || undefined,
          ipAddress,
          userAgent,
        },
      });

      logger.info(
        {
          userId: options.userId,
          action: options.action,
          entityType: options.entityType,
          entityId: options.entityId,
        },
        'Audit log recorded'
      );
    } catch (err) {
      logger.error({ err, options }, 'Failed to write audit log');
    }
  }
}
