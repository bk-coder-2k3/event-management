import { PasswordService } from '../src/services/passwordService';
import { TokenService } from '../src/services/tokenService';

describe('Security & Cryptography Services', () => {
  describe('PasswordService with Argon2id', () => {
    it('should hash password and verify successfully', async () => {
      const plainPassword = 'StrongPassword#2026';
      const hash = await PasswordService.hash(plainPassword);

      expect(hash).toBeDefined();
      expect(hash.startsWith('$argon2id$')).toBe(true);

      const isValid = await PasswordService.verify(hash, plainPassword);
      expect(isValid).toBe(true);

      const isInvalid = await PasswordService.verify(hash, 'WrongPassword#2026');
      expect(isInvalid).toBe(false);
    });

    it('should generate different salts for identical passwords', async () => {
      const pass = 'IdenticalPassword#123';
      const hash1 = await PasswordService.hash(pass);
      const hash2 = await PasswordService.hash(pass);

      expect(hash1).not.toEqual(hash2);
    });
  });

  describe('TokenService', () => {
    it('should generate valid access token with role and userId', () => {
      const payload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'priya@example.com',
        role: 'CUSTOMER' as const,
      };

      const token = TokenService.generateAccessToken(payload);
      expect(typeof token).toBe('string');

      const verified = TokenService.verifyAccessToken(token);
      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe(payload.role);
    });

    it('should generate SHA-256 token hash for database storage', () => {
      const sessionId = 'session-uuid-123';
      const userId = 'user-uuid-456';

      const { token, hash } = TokenService.generateRefreshToken(sessionId, userId);
      expect(typeof token).toBe('string');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64); // SHA-256 hex string is 64 characters

      // Verify that hashing same token yields same hash
      const rehash = TokenService.hashToken(token);
      expect(rehash).toBe(hash);
    });

    it('should generate random crypto tokens for password reset', () => {
      const token1 = TokenService.generateRandomToken();
      const token2 = TokenService.generateRandomToken();

      expect(token1.raw).not.toEqual(token2.raw);
      expect(token1.hash.length).toBe(64);
      expect(token2.hash.length).toBe(64);
    });
  });
});
