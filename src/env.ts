import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),

  // PayMob Configuration
  PAYMOB_API_KEY: z.string(),
  PAYMOB_PUBLIC_KEY: z.string(),
  PAYMOB_INTEGRATION_ID_ONLINE_CARD: z.string(),
  PAYMOB_INTEGRATION_ID_MOBILE_WALLET: z.string(),
  PAYMOB_IFRAME_ID: z.string(),
  PAYMOB_HMAC_SECRET: z.string(),
  PAYMOB_BASE_URL: z.string().url(),
  PAYMOB_WEBHOOK_URL: z.string().url(),
  PAYMOB_RETURN_URL: z.string().url(),

  // Bunny.net Configuration
  BUNNY_API_KEY: z.string(),
  BUNNY_LIBRARY_ID: z.string(),
  BUNNY_CDN_HOSTNAME: z.string(),

  // Bunny.net CDN Configuration
  BUNNY_CDN_API_KEY: z.string(),
  BUNNY_CDN_STORAGE_ZONE: z.string(),
  BUNNY_CDN_PULL_ZONE_URL: z.string(),

  // Publicly exposed variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_PAYMOB_IFRAME_ID: z.string(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const env = envSchema.parse(process.env);

export { env };