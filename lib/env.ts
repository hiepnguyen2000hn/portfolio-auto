import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  RESEND_API_KEY: z.string().min(1).default('re_placeholder_for_dev_mode'),
  CONTACT_TO_EMAIL: z.string().email().default('contact@example.com'),
  CONTACT_FROM_EMAIL: z.string().email().default('onboarding@resend.dev'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const isProduction = process.env.NODE_ENV === 'production';

export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.format();
    console.error('❌ Invalid environment variables:', formatted);
    if (isProduction) {
      throw new Error(`Invalid environment variables in production: ${JSON.stringify(formatted)}`);
    }
  }
  return result.success ? result.data : envSchema.parse({});
}

export const env = validateEnv();
