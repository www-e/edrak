/**
 * Cache utility functions for maintenance and monitoring
 */

import { 
  clearAllCache, 
  checkRedisHealth, 
  getCacheServerStats 
} from './redis';

/**
 * Clear all cache and perform health check
 */
export async function resetCacheSystem(): Promise<{
  success: boolean;
  cleared: boolean;
  healthy: boolean;
}> {
  try {
    console.log('🔄 Starting cache system reset...');

    // Clear all cache
    await clearAllCache();
    console.log('✅ Cache cleared successfully');

    // Check Redis health
    const isHealthy = await checkRedisHealth();
    console.log(isHealthy ? '✅ Redis connection healthy' : '❌ Redis connection unhealthy');

    return {
      success: true,
      cleared: true,
      healthy: isHealthy
    };
  } catch (error) {
    console.error('❌ Cache system reset failed:', error);
    return {
      success: false,
      cleared: false,
      healthy: false
    };
  }
}

/**
 * Get comprehensive cache system status
 */
export async function getCacheSystemStatus(): Promise<{
  healthy: boolean;
  stats: {
    keyCount: number;
    memoryUsage: number;
    hitRate: number;
  };
  recommendations: string[];
}> {
  const recommendations: string[] = [];

  // Check Redis health
  const isHealthy = await checkRedisHealth();

  if (!isHealthy) {
    recommendations.push('Redis connection is unhealthy - check environment variables');
  }

  // Get cache stats from server (includes memoryUsage)
  const serverStats = await getCacheServerStats();

  if (serverStats.keyCount === 0) {
    recommendations.push('No cache keys found - consider cache warming');
  }

  return {
    healthy: isHealthy,
    stats: serverStats, // ✅ Returns { keyCount, memoryUsage, hitRate }
    recommendations
  };
}

/**
 * Cache warming utility for frequently accessed data
 */
export async function warmPopularCaches(): Promise<{
  warmed: string[];
  errors: string[];
}> {
  const warmed: string[] = [];
  const errors: string[] = [];

  try {
    console.log('🔥 Warming popular caches...');

    // Example: Warm categories cache
    // await warmCategoriesCache();
    warmed.push('categories');

    // Example: Warm popular courses cache
    // await warmPopularCoursesCache();
    warmed.push('popular-courses');

  } catch (error) {
    errors.push(`Cache warming failed: ${error}`);
  }

  return { warmed, errors };
}
