import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  BUNNY_CDN_API_KEY: z.string(),
  BUNNY_CDN_STORAGE_ZONE: z.string(),
  BUNNY_CDN_PULL_ZONE_URL: z.string().url(),
  PAYMOB_API_KEY: z.string(),
  PAYMOB_INTEGRATION_ID: z.string(),
  PAYMOB_IFRAME_ID: z.string(),
  PAYMOB_HMAC: z.string(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

export { env };