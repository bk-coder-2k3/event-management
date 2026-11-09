import { createEnquirySchema } from '@vizhaspace/shared';

describe('Enquiry Management Validation', () => {
  it('should reject enquiry when minimum budget exceeds maximum budget', () => {
    const invalidBudget = {
      vendorId: '123e4567-e89b-12d3-a456-426614174000',
      customerName: 'Anitha Sundar',
      customerEmail: 'anitha@example.com',
      customerPhone: '9842199999',
      eventCity: 'Madurai',
      budgetMin: 150000,
      budgetMax: 100000, // min > max!
      requirements: 'Need complete catering for 400 wedding guests.',
    };

    const result = createEnquirySchema.safeParse(invalidBudget);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('Minimum budget cannot exceed maximum budget');
    }
  });

  it('should accept valid enquiry with dates and reasonable budget', () => {
    const validEnquiry = {
      vendorId: '123e4567-e89b-12d3-a456-426614174000',
      customerName: 'Anitha Sundar',
      customerEmail: 'anitha@example.com',
      customerPhone: '9842199999',
      eventDate: '2026-11-20',
      eventCity: 'Madurai',
      budgetMin: 80000,
      budgetMax: 120000,
      requirements: 'Looking for stage decoration with authentic jasmine and temple flower decor.',
    };

    const result = createEnquirySchema.safeParse(validEnquiry);
    expect(result.success).toBe(true);
  });
});
