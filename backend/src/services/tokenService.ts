import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { UserRole } from '@kalyanaconnect/shared';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
}

export class TokenService {
  /**
   * Generates a short-lived JWT access token
   */
  static generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });
  }

  /**
   * Generates a refresh token string and its SHA-256 hash for database storage
   */
  static generateRefreshToken(sessionId: string, userId: string): { token: string; hash: string } {
    const rawToken = jwt.sign({ sessionId, userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
    const hash = this.hashToken(rawToken);
    return { token: rawToken, hash };
  }

  /**
   * Verifies access token
   */
  static verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  }

  /**
   * Verifies refresh token
   */
  static verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }

  /**
   * Hashes a token using SHA-256
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a random cryptographic token (for email verification or password reset)
   */
  static generateRandomToken(): { raw: string; hash: string } {
    const raw = crypto.randomBytes(32).toString('hex');
    const hash = this.hashToken(raw);
    return { raw, hash };
  }
}
