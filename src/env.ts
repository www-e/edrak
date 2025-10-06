/**
 * Main environment configuration
 * This file handles server-side validation only to avoid client-side issues
 */

// Re-export server environment for server-side use
export { serverEnv as env, type ServerEnv as Env } from './lib/env-server';

// Re-export client environment for client-side use
export { clientEnv, type ClientEnv } from './lib/env-client';