import { CorsOptions } from 'cors';
import { env } from './env';

const allowedOrigins = [
  env.CLIENT_ORIGIN,
  // Customer & Public Portal (Port 3000)
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://vizhaspace.in',
  'https://www.vizhaspace.in',
  'https://kalyanaconnect.com',
  // Vendor Partner Portal (Port 3001)
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://vendor.vizhaspace.in',
  'https://partners.vizhaspace.in',
  'https://vendor.kalyanaconnect.com',
  // Admin Control Center (Port 3002)
  'http://localhost:3002',
  'http://127.0.0.1:3002',
  'https://admin.vizhaspace.in',
  'https://admin.kalyanaconnect.com',
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'test') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'CSRF-Token'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400, // 24 hours
};
