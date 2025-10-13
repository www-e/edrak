import { Redis } from '@upstash/redis';

// Redis client for caching course data and API responses
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

/**
 * Cache data with expiration time
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in seconds (default: 3600 = 1 hour)
 */
export async function cacheData<T>(key: string, data: T, ttl: number = 3600): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis cache write failed:', error);
    // Don't throw - caching is optional
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
    return cached ? JSON.parse(cached as string) : null;
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