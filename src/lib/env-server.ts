/**
 * Server-only environment validation
 * This file is only executed on the server-side
 */

import { z } from 'zod';

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string(),

  // NextAuth
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url().optional(),

  // PayMob Configuration (Server-side only)
  PAYMOB_API_KEY: z.string(),
  PAYMOB_PUBLIC_KEY: z.string(),
  PAYMOB_INTEGRATION_ID_ONLINE_CARD: z.string(),
  PAYMOB_INTEGRATION_ID_MOBILE_WALLET: z.string(),
  PAYMOB_IFRAME_ID: z.string(),
  PAYMOB_HMAC_SECRET: z.string(),
  PAYMOB_BASE_URL: z.string().url(),
  PAYMOB_WEBHOOK_URL: z.string().url(),
  PAYMOB_RETURN_URL: z.string().url(),

  // Bunny.net Configuration (Server-side only)
  BUNNY_API_KEY: z.string().min(1, "BUNNY_API_KEY is required for Bunny.net operations"),
  BUNNY_STORAGE_ZONE_NAME: z.string().min(1, "BUNNY_STORAGE_ZONE_NAME is required for file storage"),
  BUNNY_STORAGE_REGION: z.string().min(1, "BUNNY_STORAGE_REGION is required for Bunny.net storage region"),
  BUNNY_CDN_HOSTNAME: z.string().min(1, "BUNNY_CDN_HOSTNAME is required for file access"),
  BUNNY_PULL_ZONE_URL: z.string().url("BUNNY_PULL_ZONE_URL must be a valid URL"),

  // Publicly exposed variables (available on both server and client)
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_PAYMOB_IFRAME_ID: z.string(),

  // Redis Configuration (Server-side only)
  UPSTASH_REDIS_URL: z.string().url("UPSTASH_REDIS_URL must be a valid URL for Redis connection"),
  UPSTASH_REDIS_TOKEN: z.string().min(1, "UPSTASH_REDIS_TOKEN is required for Redis authentication"),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let serverEnv: ServerEnv;

try {
  serverEnv = serverEnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Server environment validation failed:');
    error.issues.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });

    // Check if the error is due to missing Bunny.net configuration
    const bunnyErrors = error.issues.filter(err =>
      err.path.some(path => path.toString().includes('BUNNY'))
    );

    if (bunnyErrors.length > 0) {
      console.error('\n📝 Note: Bunny.net configuration is required for file upload functionality.');
      console.error('   Please configure these variables in Vercel dashboard with your actual Bunny.net credentials.');
      console.error('   See .env.example for the required format.\n');
    }

    throw new Error('Server environment validation failed. Please check your environment configuration.');
  }
  throw error;
}

export { serverEnv };
export type { ServerEnv };