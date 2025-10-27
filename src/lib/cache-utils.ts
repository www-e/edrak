/**
 * Cache utility functions for maintenance and monitoring
 * Note: Caching has been removed to improve performance
 */

/**
 * Clear all cache and perform health check
 */
export async function resetCacheSystem(): Promise<{
  success: boolean;
  cleared: boolean;
  healthy: boolean;
}> {
  try {
    console.log('🔄 Cache system reset - no caching active');

    return {
      success: true,
      cleared: true,
      healthy: true
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

  recommendations.push('Caching has been disabled for performance optimization');

  return {
    healthy: true,
    stats: {
      keyCount: 0,
      memoryUsage: 0,
      hitRate: 0
    },
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
