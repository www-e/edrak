import { Redis } from '@upstash/redis';

// ============================================================================
// 🔧 Configuration & Setup
// ============================================================================

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error(
    '❌ Redis credentials missing. Set UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN in .env.local'
  );
}

// Upstash handles JSON serialization automatically by default
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
  automaticDeserialization: true, // Default: auto JSON parse
});

// ============================================================================
// 🎨 Enhanced Logger Utility with Console Grouping
// ============================================================================

type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'debug';

class CacheLogger {
  private enabled = process.env.NODE_ENV !== 'production';
  
  private colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    debug: '\x1b[90m',   // Gray
    reset: '\x1b[0m',
  };

  private icons = {
    info: 'ℹ️',
    success: '✅',
    warn: '⚠️',
    error: '❌',
    debug: '🔍',
  };

  group(label: string, level: LogLevel = 'info') {
    if (!this.enabled) return;
    console.group(
      `${this.colors[level]}${this.icons[level]} ${label}${this.colors.reset}`
    );
  }

  groupEnd() {
    if (!this.enabled) return;
    console.groupEnd();
  }

  log(level: LogLevel, message: string, data?: unknown) {
    if (!this.enabled) return;
    
    const color = this.colors[level];
    const icon = this.icons[level];
    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    
    console.log(
      `${color}${icon} [${timestamp}] ${message}${this.colors.reset}`
    );
    
    if (data !== undefined) {
      console.log(data);
    }
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  success(message: string, data?: unknown) {
    this.log('success', message, data);
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }

  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }

  table(data: unknown) {
    if (!this.enabled) return;
    console.table(data);
  }
}

const logger = new CacheLogger();

// ============================================================================
// 🧹 Optimized Data Sanitization (Simplified - Let Upstash Handle JSON)
// ============================================================================

/**
 * Sanitize data for Redis storage by removing non-serializable properties
 * Optimized for Prisma models - Upstash handles JSON automatically
 */
export function sanitizeForCache<T>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }

  try {
    // Recursive sanitization to remove Prisma metadata
    const cleaned = JSON.parse(
      JSON.stringify(data, (key, value) => {
        // Filter out non-serializable properties
        if (
          typeof value === 'function' ||
          typeof value === 'symbol' ||
          key === '_client' ||
          key === 'constructor' ||
          key === '$metadata' ||
          key === '$isInstance' ||
          key === '$prototype'
        ) {
          return undefined;
        }

        // Handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }

        return value;
      })
    );

    return cleaned;
  } catch (error) {
    logger.error('Sanitization failed', error);
    return data;
  }
}

// ============================================================================
// 💾 Core Cache Operations (Fixed - No Manual Stringify)
// ============================================================================

/**
 * Cache data with TTL and validation
 * @param key - Cache key
 * @param data - Data to cache (will be auto-serialized by Upstash)
 * @param ttl - Time to live in seconds (default: 3600 = 1 hour)
 */
export async function cacheData<T>(
  key: string,
  data: T,
  ttl: number = 3600
): Promise<boolean> {
  logger.group(`💾 Cache SET: ${key}`, 'info');
  
  try {
    const sanitized = sanitizeForCache(data);

    // Validate data is not empty
    if (!sanitized || (typeof sanitized === 'object' && Object.keys(sanitized).length === 0)) {
      logger.error('Empty data, skipping cache');
      logger.groupEnd();
      return false;
    }

    logger.debug(`TTL: ${ttl}s | Type: ${typeof sanitized}`);

    // ✅ FIX: Store directly - Upstash auto-serializes to JSON
    await redis.set(key, sanitized, { ex: ttl });

    logger.success('Cache stored successfully');
    logger.groupEnd();
    return true;
  } catch (error) {
    logger.error('Cache write failed', error);
    logger.groupEnd();
    return false;
  }
}

/**
 * Get cached data with validation
 * @param key - Cache key
 * @returns Cached data or null (auto-deserialized by Upstash)
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  logger.group(`🔍 Cache GET: ${key}`, 'info');

  try {
    // ✅ FIX: Get directly - Upstash auto-deserializes from JSON
    const cached = await redis.get<T>(key);

    if (!cached) {
      logger.warn('Cache MISS');
      logger.groupEnd();
      return null;
    }

    // Validate retrieved data
    if (typeof cached === 'object' && Object.keys(cached).length === 0) {
      logger.error('Empty object retrieved, treating as miss');
      await redis.del(key); // Auto-cleanup
      logger.groupEnd();
      return null;
    }

    logger.success('Cache HIT');
    logger.groupEnd();
    return cached;
  } catch (error) {
    logger.error('Cache read failed', error);
    logger.groupEnd();
    return null;
  }
}

/**
 * Delete cached data
 */
export async function deleteCachedData(key: string): Promise<boolean> {
  logger.group(`🗑️  Cache DELETE: ${key}`, 'warn');
  
  try {
    await redis.del(key);
    logger.success('Cache entry deleted');
    logger.groupEnd();
    return true;
  } catch (error) {
    logger.error('Cache delete failed', error);
    logger.groupEnd();
    return false;
  }
}

/**
 * Batch cache operations using pipeline
 */
export async function batchCacheGet<T>(keys: string[]): Promise<(T | null)[]> {
  logger.group(`📦 Batch GET: ${keys.length} keys`, 'info');

  try {
    const pipeline = redis.pipeline();
    keys.forEach((key) => pipeline.get(key));
    
    const results = await pipeline.exec();
    logger.success(`Retrieved ${results.length} items`);
    logger.groupEnd();

    return results.map((result) => {
      if (!result) return null;
      return result as T;
    });
  } catch (error) {
    logger.error('Batch get failed', error);
    logger.groupEnd();
    return keys.map(() => null);
  }
}

/**
 * Batch cache set using pipeline
 */
export async function batchCacheSet<T>(
  items: Array<{ key: string; data: T; ttl?: number }>
): Promise<boolean> {
  logger.group(`📦 Batch SET: ${items.length} items`, 'info');

  try {
    const pipeline = redis.pipeline();
    
    items.forEach(({ key, data, ttl = 3600 }) => {
      const sanitized = sanitizeForCache(data);
      if (sanitized) {
        pipeline.set(key, sanitized, { ex: ttl });
      }
    });

    await pipeline.exec();
    logger.success('Batch cache completed');
    logger.groupEnd();
    return true;
  } catch (error) {
    logger.error('Batch set failed', error);
    logger.groupEnd();
    return false;
  }
}

// ============================================================================
// 🧹 Cache Management
// ============================================================================

/**
 * Clear all cached data
 */
export async function clearAllCache(): Promise<boolean> {
  logger.group('🧹 Clearing ALL cache', 'warn');
  
  try {
    await redis.flushall();
    logger.success('All cache cleared');
    logger.groupEnd();
    return true;
  } catch (error) {
    logger.error('Cache clear failed', error);
    logger.groupEnd();
    return false;
  }
}

/**
 * Health check for Redis connection
 */
export async function checkRedisHealth(): Promise<boolean> {
  logger.group('🏥 Redis Health Check', 'info');
  
  try {
    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;
    
    logger.success(`Redis healthy (${latency}ms)`);
    logger.groupEnd();
    return true;
  } catch (error) {
    logger.error('Redis health check failed', error);
    logger.groupEnd();
    return false;
  }
}

// ============================================================================
// 🎯 Course-Specific Helpers
// ============================================================================

/**
 * Generate consistent cache key for course queries
 */
export function generateCourseCacheKey(
  filters: Record<string, string | number | undefined>
): string {
  const sorted = Object.keys(filters)
    .filter((key) => filters[key] !== undefined)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key]!;
      return acc;
    }, {} as Record<string, string | number>);

  const key = `courses:${JSON.stringify(sorted)}`;
  logger.debug(`Generated key: ${key}`);
  return key;
}

/**
 * Cache course data with extended TTL (2 hours)
 */
export async function cacheCourseData<T>(
  key: string,
  data: T
): Promise<boolean> {
  return cacheData(key, data, 7200); // 2 hours
}

/**
 * Get course data with auto-refresh on miss
 */
export async function getCourseData<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await getCachedData<T>(key);
  
  if (cached) {
    return cached;
  }

  logger.info('Fetching fresh course data');
  const fresh = await fetchFn();
  await cacheCourseData(key, fresh);
  
  return fresh;
}

// ============================================================================
// 📊 Cache Statistics & Monitoring
// ============================================================================

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  keyCount: number;
  avgLatency: number;
}

const metrics = {
  hits: 0,
  misses: 0,
  totalLatency: 0,
  requests: 0,
};

export function trackCacheHit() {
  metrics.hits++;
  metrics.requests++;
}

export function trackCacheMiss() {
  metrics.misses++;
  metrics.requests++;
}

export function trackLatency(ms: number) {
  metrics.totalLatency += ms;
}

export function getCacheStats(): CacheStats {
  const hitRate = metrics.requests > 0 
    ? (metrics.hits / metrics.requests) * 100 
    : 0;
  
  const avgLatency = metrics.requests > 0
    ? metrics.totalLatency / metrics.requests
    : 0;

  return {
    hits: metrics.hits,
    misses: metrics.misses,
    hitRate: Math.round(hitRate * 100) / 100,
    keyCount: 0,
    avgLatency: Math.round(avgLatency * 100) / 100,
  };
}

export function resetMetrics() {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.totalLatency = 0;
  metrics.requests = 0;
  logger.info('Cache metrics reset');
}

export function logCacheMetrics() {
  logger.group('📊 Cache Metrics', 'info');
  logger.table(getCacheStats());
  logger.groupEnd();
}

// ============================================================================
// 🔍 Debugging Utilities
// ============================================================================

/**
 * Inspect cache entry
 */
export async function inspectCache(key: string): Promise<void> {
  logger.group(`🔍 Inspecting: ${key}`, 'debug');
  
  try {
    const value = await redis.get(key);
    const ttl = await redis.ttl(key);
    
    logger.info(`TTL: ${ttl}s`);
    logger.info(`Type: ${typeof value}`);
    
    if (value) {
      logger.table(value);
    }
  } catch (error) {
    logger.error('Inspection failed', error);
  }
  
  logger.groupEnd();
}

/**
 * Get cache statistics (placeholder for Upstash limitations)
 */
export async function getCacheServerStats(): Promise<{
  keyCount: number;
  memoryUsage: number;
  hitRate: number;
}> {
  // Upstash REST API doesn't expose INFO command
  return {
    keyCount: 0,
    memoryUsage: 0,
    hitRate: 0
  };
}
