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
 * Lazy cache warming utility - warms on first miss to avoid server start delay
 */
export async function lazyWarmCache(key: string): Promise<void> {
  try {
    console.log(`🔥 Lazy warming cache for: ${key}`);

    // Warm popular courses if it's a course key
    if (key.startsWith('courses:')) {
      const { CourseService } = await import('@/server/services/courseService');
      await CourseService.getPublishedCourses({ limit: 12 });
    }

    // Warm categories if it's a category key
    if (key.startsWith('categories:')) {
      const { AdminCategoryService } = await import('@/server/services/categoryService');
      await AdminCategoryService.getAllCategories();
    }
  } catch (error) {
    console.error(`Lazy warming failed for ${key}:`, error);
  }
}
