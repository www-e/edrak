/**
 * Performance Testing Utilities
 * Measures response times and performance metrics for different endpoints and services
 */

export interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  timestamp: number;
  cacheHit?: boolean;
  databaseQueries?: number;
  memoryUsage?: number;
}

export interface TestResult {
  metrics: PerformanceMetrics[];
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalRequests: number;
  cacheHitRate?: number;
}

export class PerformanceTester {
  private results: PerformanceMetrics[] = [];

  /**
   * Test API endpoint performance
   */
  async testEndpoint(
    url: string,
    method: 'GET' | 'POST' = 'GET',
    iterations: number = 10
  ): Promise<TestResult> {
    const metrics: PerformanceMetrics[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();

      try {
        const response = await fetch(url, { method });
        const endTime = performance.now();

        metrics.push({
          endpoint: url,
          method,
          responseTime: endTime - startTime,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(`Request ${i + 1} failed:`, error);
        metrics.push({
          endpoint: url,
          method,
          responseTime: -1, // Error indicator
          timestamp: Date.now(),
        });
      }

      // Small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.results.push(...metrics);

    return this.calculateStats(metrics);
  }

  /**
   * Test service method performance
   */
  async testServiceMethod<T>(
    serviceCall: () => Promise<T>,
    methodName: string,
    iterations: number = 10
  ): Promise<TestResult> {
    const metrics: PerformanceMetrics[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();

      try {
        await serviceCall();
        const endTime = performance.now();

        metrics.push({
          endpoint: methodName,
          method: 'SERVICE_CALL',
          responseTime: endTime - startTime,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(`Service call ${i + 1} failed:`, error);
        metrics.push({
          endpoint: methodName,
          method: 'SERVICE_CALL',
          responseTime: -1,
          timestamp: Date.now(),
        });
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    this.results.push(...metrics);

    return this.calculateStats(metrics);
  }

  /**
   * Test database query performance
   */
  async testDatabaseQuery<T>(
    queryFn: () => Promise<T>,
    queryName: string,
    iterations: number = 10
  ): Promise<TestResult> {
    const metrics: PerformanceMetrics[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();

      try {
        await queryFn();
        const endTime = performance.now();

        metrics.push({
          endpoint: queryName,
          method: 'DATABASE_QUERY',
          responseTime: endTime - startTime,
          timestamp: Date.now(),
          databaseQueries: 1,
        });
      } catch (error) {
        console.error(`Database query ${i + 1} failed:`, error);
        metrics.push({
          endpoint: queryName,
          method: 'DATABASE_QUERY',
          responseTime: -1,
          timestamp: Date.now(),
          databaseQueries: 1,
        });
      }
    }

    this.results.push(...metrics);

    return this.calculateStats(metrics);
  }

  /**
   * Calculate statistics from metrics
   */
  private calculateStats(metrics: PerformanceMetrics[]): TestResult {
    const validMetrics = metrics.filter(m => m.responseTime > 0);
    const responseTimes = validMetrics.map(m => m.responseTime);

    return {
      metrics,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0,
      minResponseTime: Math.min(...responseTimes) || 0,
      maxResponseTime: Math.max(...responseTimes) || 0,
      totalRequests: metrics.length,
      cacheHitRate: this.calculateCacheHitRate(validMetrics),
    };
  }

  /**
   * Calculate cache hit rate from metrics
   */
  private calculateCacheHitRate(metrics: PerformanceMetrics[]): number {
    const cacheHits = metrics.filter(m => m.cacheHit === true).length;
    return metrics.length > 0 ? (cacheHits / metrics.length) * 100 : 0;
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      summary: this.calculateOverallStats(),
      detailedResults: this.results.slice(-50), // Last 50 results
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Calculate overall statistics
   */
  private calculateOverallStats() {
    const validResults = this.results.filter(r => r.responseTime > 0);
    const responseTimes = validResults.map(r => r.responseTime);

    if (responseTimes.length === 0) {
      return {
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        totalRequests: 0,
      };
    }

    return {
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      totalRequests: this.results.length,
    };
  }

  /**
   * Clear test results
   */
  clearResults(): void {
    this.results = [];
  }
}

// Export singleton instance
export const performanceTester = new PerformanceTester();

/**
 * Convenience functions for common tests
 */
export async function testCourseListings(iterations: number = 10): Promise<TestResult> {
  return await performanceTester.testEndpoint('/api/courses', 'GET', iterations);
}

export async function testAdminDashboard(iterations: number = 10): Promise<TestResult> {
  return await performanceTester.testEndpoint('/api/admin/dashboard', 'GET', iterations);
}

export async function testStudentDashboard(iterations: number = 10): Promise<TestResult> {
  return await performanceTester.testEndpoint('/api/student/dashboard', 'GET', iterations);
}

export async function testCategoryService(iterations: number = 10): Promise<TestResult> {
  return await performanceTester.testEndpoint('/api/categories', 'GET', iterations);
}