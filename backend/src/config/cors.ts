import { CorsOptions } from 'cors';
import { env } from './env';

const allowedOrigins = [
  env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://kalyanaconnect.com',
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
