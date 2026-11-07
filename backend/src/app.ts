import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import { corsOptions } from './config/cors';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authRouter } from './modules/auth/auth.routes';
import { vendorsRouter } from './modules/vendors/vendors.routes';
import { categoriesRouter } from './modules/categories/categories.routes';
import { enquiriesRouter } from './modules/enquiries/enquiries.routes';
import { reviewsRouter } from './modules/reviews/reviews.routes';
import { usersRouter } from './modules/users/users.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { prisma } from './config/db';
import { NotFoundError } from './utils/errors';

export const app = express();

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(cors(corsOptions));

// Cookie Parser
app.use(cookieParser(env.COOKIE_SECRET));

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// General Rate Limiter
app.use(generalLimiter);

// Serve local uploads
app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

// Health and Readiness probes
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'ready', database: 'connected' });
  } catch (error: any) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', details: error.message });
  }
});

// Mount versioned API routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/vendors', vendorsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/enquiries', enquiriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/admin', adminRouter);

app.use(env.API_PREFIX, apiRouter);

// 404 Handler
app.use((req: Request, _res: Response, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);
