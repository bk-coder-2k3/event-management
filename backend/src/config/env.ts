import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CLIENT_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/kalyanaconnect?schema=public'),
  JWT_ACCESS_SECRET: z.string().default('kalyana_super_secret_jwt_access_token_key_change_in_production_2026'),
  JWT_REFRESH_SECRET: z.string().default('kalyana_super_secret_jwt_refresh_token_key_change_in_production_2026'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('kalyana_cookie_secret_change_in_production_key_2026'),
  STORAGE_DRIVER: z.enum(['local', 'cloudinary']).default('local'),
  UPLOAD_DIR: z.string().default('./uploads'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  DEFAULT_ADMIN_EMAIL: z.string().default('admin@kalyanaconnect.com'),
  DEFAULT_ADMIN_PASSWORD: z.string().default('AdminSecure#2026'),
  DEFAULT_ADMIN_NAME: z.string().default('KalyanaConnect Platform Admin'),
});

export const env = envSchema.parse(process.env);
