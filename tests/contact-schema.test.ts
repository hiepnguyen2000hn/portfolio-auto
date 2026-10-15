import { describe, it, expect } from 'vitest';
import { ContactSchema } from '@/lib/schemas/contact';

describe('ContactSchema Validation', () => {
  it('validates correct form inputs successfully', () => {
    const validData = {
      name: 'Nguyen Van A',
      email: 'alex.nguyen@example.com',
      message: 'Xin chào, tôi rất ấn tượng với portfolio của bạn và muốn trao đổi về cơ hội hợp tác!',
      website: '',
    };

    const result = ContactSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Nguyen Van A');
      expect(result.data.email).toBe('alex.nguyen@example.com');
    }
  });

  it('allows optional or null honeypot website field', () => {
    const dataWithoutWebsite = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Great portfolio! Would love to connect regarding open roles.',
    };
    expect(ContactSchema.safeParse(dataWithoutWebsite).success).toBe(true);

    const dataWithNullWebsite = {
      ...dataWithoutWebsite,
      website: null,
    };
    expect(ContactSchema.safeParse(dataWithNullWebsite).success).toBe(true);
  });

  it('allows honeypot field to parse string so API route can detect bot', () => {
    const spammerData = {
      name: 'Bot Spammer',
      email: 'bot@spam.com',
      message: 'Click this link to win free money right now!',
      website: 'https://spam-link.com',
    };
    const result = ContactSchema.safeParse(spammerData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBe('https://spam-link.com');
    }
  });

  it('fails when required fields are missing', () => {
    expect(ContactSchema.safeParse({}).success).toBe(false);

    const missingName = {
      email: 'test@example.com',
      message: 'This is a message with sufficient length',
    };
    const resName = ContactSchema.safeParse(missingName);
    expect(resName.success).toBe(false);

    const missingEmail = {
      name: 'Test User',
      message: 'This is a message with sufficient length',
    };
    const resEmail = ContactSchema.safeParse(missingEmail);
    expect(resEmail.success).toBe(false);

    const missingMessage = {
      name: 'Test User',
      email: 'test@example.com',
    };
    const resMessage = ContactSchema.safeParse(missingMessage);
    expect(resMessage.success).toBe(false);
  });

  it('fails when name is too short (< 2 characters) or too long (> 80 characters)', () => {
    const tooShort = {
      name: 'A',
      email: 'test@example.com',
      message: 'This is a message with sufficient length',
    };
    const resShort = ContactSchema.safeParse(tooShort);
    expect(resShort.success).toBe(false);

    const tooLong = {
      name: 'A'.repeat(81),
      email: 'test@example.com',
      message: 'This is a message with sufficient length',
    };
    const resLong = ContactSchema.safeParse(tooLong);
    expect(resLong.success).toBe(false);
  });

  it('fails when email format is invalid', () => {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
    ];

    for (const email of invalidEmails) {
      const res = ContactSchema.safeParse({
        name: 'Valid Name',
        email,
        message: 'This is a message with sufficient length',
      });
      expect(res.success).toBe(false);
    }
  });

  it('fails when message is too short (< 10 chars) or too long (> 2000 chars)', () => {
    const tooShort = {
      name: 'Valid Name',
      email: 'test@example.com',
      message: 'Short msg', // 9 chars
    };
    expect(ContactSchema.safeParse(tooShort).success).toBe(false);

    const tooLong = {
      name: 'Valid Name',
      email: 'test@example.com',
      message: 'A'.repeat(2001),
    };
    expect(ContactSchema.safeParse(tooLong).success).toBe(false);
  });
});
