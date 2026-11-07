import { registerSchema, loginSchema } from '@kalyanaconnect/shared';

describe('Auth Validation & RBAC Security Rules', () => {
  describe('Registration Schema', () => {
    it('should reject registration if password lacks complexity', () => {
      const invalidData = {
        fullName: 'Ramesh Kumar',
        email: 'ramesh@example.com',
        password: 'weak', // no uppercase, no numbers, < 8 chars
        role: 'CUSTOMER',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 8 characters');
      }
    });

    it('should reject attempt to register directly as ADMIN', () => {
      const adminAttempt = {
        fullName: 'Hacker User',
        email: 'hacker@example.com',
        password: 'SecurePassword#123',
        role: 'ADMIN', // Forbidden! Only CUSTOMER or VENDOR permitted
      };

      const result = registerSchema.safeParse(adminAttempt);
      expect(result.success).toBe(false);
    });

    it('should accept valid vendor registration with Indian phone number', () => {
      const validVendor = {
        fullName: 'Meenakshi Decorators',
        email: 'decor@meenakshi.com',
        password: 'ValidPassword#2026',
        phone: '9842101234',
        role: 'VENDOR' as const,
      };

      const result = registerSchema.safeParse(validVendor);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('decor@meenakshi.com');
        expect(result.data.role).toBe('VENDOR');
      }
    });
  });

  describe('Login Schema', () => {
    it('should normalize email to lowercase', () => {
      const input = {
        email: '  MaduraiWedding@GMAIL.COM  ',
        password: 'AnyPassword123',
      };

      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('maduraiwedding@gmail.com');
      }
    });
  });
});
