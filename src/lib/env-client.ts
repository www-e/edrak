/**
 * Client-only environment validation
 * This file is safe to use in client-side components
 * Only contains NEXT_PUBLIC_* variables that are available in the browser
 */

import { z } from 'zod';

const clientEnvSchema = z.object({
  // Publicly exposed variables (available on both server and client)
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_PAYMOB_IFRAME_ID: z.string(),

  // Node Environment (available in browser)
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type ClientEnv = z.infer<typeof clientEnvSchema>;

let clientEnv: ClientEnv;

try {
  clientEnv = clientEnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Client environment validation failed:');
    error.issues.forEach((err) => {
      console.error(`  ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error('Client environment validation failed. Please check your environment configuration.');
  }
  throw error;
}

export { clientEnv };
export type { ClientEnv };