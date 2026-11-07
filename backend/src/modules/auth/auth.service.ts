import { prisma } from '../../config/db';
import { PasswordService } from '../../services/passwordService';
import { TokenService } from '../../services/tokenService';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors';
import { ROLES, UserRole } from '@kalyanaconnect/shared';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  /**
   * Register a new CUSTOMER or VENDOR.
   * Privileged ADMIN registration is strictly forbidden through this API.
   */
  static async register(data: {
    fullName: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
  }) {
    const normalizedEmail = data.email.toLowerCase().trim();

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Role check - never allow ADMIN
    const assignedRole = data.role === ROLES.VENDOR ? ROLES.VENDOR : ROLES.CUSTOMER;

    // Hash password with Argon2id
    const passwordHash = await PasswordService.hash(data.password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: data.phone?.trim() || null,
        role: assignedRole,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Create session & tokens
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const { token: refreshToken, hash: tokenHash } = TokenService.generateRefreshToken(sessionId, user.id);

    await prisma.refreshSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login with email and password
   */
  static async login(email: string, plainPassword: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            approvalStatus: true,
            verificationStatus: true,
          },
        },
      },
    });

    // Use generic message to prevent account enumeration
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'DISABLED' || user.status === 'SUSPENDED') {
      throw new UnauthorizedError(`Your account is currently ${user.status.toLowerCase()}. Please contact support.`);
    }

    const isMatch = await PasswordService.verify(user.passwordHash, plainPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Create refresh session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const { token: refreshToken, hash: tokenHash } = TokenService.generateRefreshToken(sessionId, user.id);

    await prisma.refreshSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate refresh token and issue new access token.
   * Implements token reuse detection to prevent session hijacking.
   */
  static async refreshToken(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }

    let payload: { sessionId: string; userId: string };
    try {
      payload = TokenService.verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokenHash = TokenService.hashToken(rawRefreshToken);

    const session = await prisma.refreshSession.findUnique({
      where: { id: payload.sessionId },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedError('Invalid session');
    }

    // Reuse detection: If session was revoked or replaced, potential theft!
    if (session.revokedAt !== null || session.replacedBySessionId !== null) {
      logger.warn({ userId: session.userId, sessionId: session.id }, 'Refresh token reuse detected! Revoking all sessions.');
      await prisma.refreshSession.updateMany({
        where: { userId: session.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedError('Session compromised. Please log in again.');
    }

    if (new Date() > session.expiresAt) {
      throw new UnauthorizedError('Refresh session expired');
    }

    if (session.user.status !== 'ACTIVE') {
      throw new UnauthorizedError('Account is not active');
    }

    // Generate new rotated session
    const newSessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const { token: newRefreshToken, hash: newTokenHash } = TokenService.generateRefreshToken(
      newSessionId,
      session.userId
    );

    // Atomically invalidate old session and create new session in transaction
    await prisma.$transaction([
      prisma.refreshSession.update({
        where: { id: session.id },
        data: {
          revokedAt: new Date(),
          replacedBySessionId: newSessionId,
        },
      }),
      prisma.refreshSession.create({
        data: {
          id: newSessionId,
          userId: session.userId,
          tokenHash: newTokenHash,
          expiresAt,
        },
      }),
    ]);

    const accessToken = TokenService.generateAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role as any,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: session.user.id,
        fullName: session.user.fullName,
        email: session.user.email,
        phone: session.user.phone,
        role: session.user.role,
        status: session.user.status,
      },
    };
  }

  /**
   * Revoke refresh session and log out
   */
  static async logout(rawRefreshToken?: string) {
    if (!rawRefreshToken) return;
    try {
      const payload = TokenService.verifyRefreshToken(rawRefreshToken);
      await prisma.refreshSession.updateMany({
        where: { id: payload.sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Ignore invalid token on logout
    }
  }

  /**
   * Get authenticated user profile
   */
  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
        vendorProfile: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            approvalStatus: true,
            verificationStatus: true,
            rejectionReason: true,
            city: true,
            district: true,
            categoryId: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  /**
   * Initiate password reset
   */
  static async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return { message: 'If an account exists with this email, a reset link will be sent.' };
    }

    const { raw, hash } = TokenService.generateRandomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hash,
        expiresAt,
      },
    });

    logger.info({ email: normalizedEmail, tokenPreview: raw.substring(0, 8) }, 'Password reset requested');

    return {
      message: 'If an account exists with this email, a reset link will be sent.',
      // In development, return the token for testing convenience
      ...(env.NODE_ENV !== 'production' ? { resetToken: raw } : {}),
    };
  }

  /**
   * Complete password reset
   */
  static async resetPassword(token: string, newPassword: string) {
    const tokenHash = TokenService.hashToken(token);

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    const passwordHash = await PasswordService.hash(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      // Revoke all existing sessions for this user for security
      prisma.refreshSession.updateMany({
        where: { userId: resetRecord.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password has been successfully updated. Please log in with your new credentials.' };
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string) {
    const tokenHash = TokenService.hashToken(token);

    const emailRecord = await prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!emailRecord) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: emailRecord.userId },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: emailRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Email verified successfully.' };
  }
}
