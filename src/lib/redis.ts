import { Redis } from '@upstash/redis';

// Redis client for caching course data and API responses
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

/**
 * Sanitize data for JSON serialization by removing non-serializable properties
 * @param data - Data to sanitize
 * @returns Sanitized data safe for JSON serialization
 */
function sanitizeForCache<T>(data: T): T {
  try {
    // Test if data is already serializable
    JSON.stringify(data);
    return data;
  } catch {
    // If serialization fails, convert to a serializable format
    return JSON.parse(JSON.stringify(data));
  }
}

/**
 * Cache data with expiration time
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in seconds (default: 3600 = 1 hour)
 */
export async function cacheData<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
  try {
    const sanitizedData = sanitizeForCache(data);
    await redis.setex(key, ttl, JSON.stringify(sanitizedData));
  } catch (error) {
    console.error('Redis cache write failed:', error);
    // Don't throw - caching is optional
  }
}

/**
 * Safely test if a string is valid JSON
 * @param str - String to test
 * @returns true if valid JSON, false otherwise
 */
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get cached data
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);

    // If no cached data, return null
    if (!cached) return null;

    // Convert to string in case it's not already
    const cachedStr = String(cached);

    // Check for obviously corrupted entries
    if (cachedStr === '[object Object]' ||
        cachedStr === 'null' ||
        cachedStr === 'undefined' ||
        cachedStr === '{}' ||
        cachedStr === '[]') {
      console.log('Redis cache corrupted entry detected, treating as cache miss');
      return null;
    }

    // Test if the cached string is valid JSON
    if (!isValidJSON(cachedStr)) {
      console.log('Redis cache contains invalid JSON, treating as cache miss');
      return null;
    }

    // Parse the valid JSON
    return JSON.parse(cachedStr);
  } catch (error) {
    console.error('Redis cache read failed:', error);
    return null;
  }
}

/**
 * Delete cached data
 * @param key - Cache key to delete
 */
export async function deleteCachedData(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis cache delete failed:', error);
  }
}

/**
 * Clear all cached data (useful for clearing corrupted entries)
 */
export async function clearAllCache(): Promise<void> {
  try {
    await redis.flushall();
    console.log('All Redis cache cleared successfully');
  } catch (error) {
    console.error('Redis cache clear failed:', error);
  }
}

/**
 * Generate cache key for course queries
 * @param filters - Query filters
 * @returns Consistent cache key
 */
export function generateCourseCacheKey(filters: Record<string, string | number | undefined>): string {
  const sortedFilters = Object.keys(filters)
    .sort()
    .reduce((result, key) => {
      if (filters[key] !== undefined) {
        result[key] = filters[key];
      }
      return result;
    }, {} as Record<string, string | number>);

  return `courses:${JSON.stringify(sortedFilters)}`;
}

/**
 * Cache course data with course-specific TTL
 * @param key - Cache key
 * @param data - Course data to cache
 */
export async function cacheCourseData<T>(key: string, data: T): Promise<void> {
  // Courses change less frequently, cache for 2 hours
  await cacheData(key, data, 7200);
}