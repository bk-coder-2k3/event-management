import { generateSlug } from '../src/utils/slugify';
import { adminVendorDecisionSchema, createVendorSchema } from '@vizhaspace/shared';

describe('Vendor Logic & Approval Workflow Tests', () => {
  describe('Slug Generation', () => {
    it('should generate clean URL slug for Tamil Nadu vendors', () => {
      const name = 'Sri Meenakshi Sundareswarar Kalyana Mandapam (AC)';
      const slug = generateSlug(name);
      expect(slug).toBe('sri-meenakshi-sundareswarar-kalyana-mandapam-ac');
    });

    it('should strip special characters and consecutive hyphens', () => {
      const name = 'Vaigai Memories --- Candid Photography & 4K Drone!!';
      const slug = generateSlug(name);
      expect(slug).toBe('vaigai-memories-candid-photography-4k-drone');
    });
  });

  describe('Admin Vendor Approval Decisions', () => {
    it('should allow approving vendor without rejection reason', () => {
      const decision = {
        status: 'APPROVED' as const,
        verificationStatus: 'VERIFIED' as const,
      };

      const result = adminVendorDecisionSchema.safeParse(decision);
      expect(result.success).toBe(true);
    });

    it('should require rejection reason when rejecting vendor profile', () => {
      const decisionWithoutReason = {
        status: 'REJECTED' as const,
        rejectionReason: '',
      };

      const result = adminVendorDecisionSchema.safeParse(decisionWithoutReason);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('rejectionReason');
      }
    });

    it('should accept rejection when valid reason is provided', () => {
      const decisionWithReason = {
        status: 'REJECTED' as const,
        rejectionReason: 'Invalid business license and unreachable contact number.',
      };

      const result = adminVendorDecisionSchema.safeParse(decisionWithReason);
      expect(result.success).toBe(true);
    });
  });

  describe('Vendor Profile Creation Schema', () => {
    it('should require valid 6-digit Tamil Nadu PIN code', () => {
      const invalidPin = {
        businessName: 'Madurai Mandapam',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Authentic kalyana mandapam in Madurai with AC and dining.',
        address: '10 West Tower Street',
        city: 'Madurai',
        district: 'Madurai',
        postalCode: '6250', // invalid PIN length
      };

      const result = createVendorSchema.safeParse(invalidPin);
      expect(result.success).toBe(false);
    });
  });
});
