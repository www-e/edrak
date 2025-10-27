/**
 * Advanced caching service for admin dashboard optimization
 * Provides in-memory caching with TTL (Time To Live) support
 * Note: Redis caching has been removed for performance optimization
 */

interface CacheItem<T> {
  data: T;
  expiry: number;
  createdAt: number;
}

export class CacheService {
  private static cache = new Map<string, CacheItem<unknown>>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private static readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes
  private static cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup interval to remove expired items
    if (typeof globalThis !== 'undefined' && !CacheService.cleanupInterval) {
      CacheService.cleanupInterval = setInterval(() => CacheService.cleanup(), CacheService.CLEANUP_INTERVAL);
    }
  }

  /**
   * Set cache item with TTL
   */
  static set<T>(key: string, data: T, ttlMs: number = CacheService.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      expiry: now + ttlMs,
      createdAt: now,
    });

    // Log cache set for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache SET: ${key} (TTL: ${ttlMs}ms)`);
    }
  }

  /**
   * Get cache item if not expired
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    const now = Date.now();

    // Check if item has expired
    if (now > item.expiry) {
      this.cache.delete(key);

      if (process.env.NODE_ENV === 'development') {
        console.log(`Cache EXPIRED: ${key}`);
      }

      return null;
    }

    // Log cache hit for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache HIT: ${key}`);
    }

    return item.data as T;
  }

  /**
   * Delete specific cache item
   */
  static delete(key: string): boolean {
    const deleted = this.cache.delete(key);

    if (process.env.NODE_ENV === 'development' && deleted) {
      console.log(`Cache DELETED: ${key}`);
    }

    return deleted;
  }

  /**
   * Clear all cache items
   */
  static clear(): void {
    const size = this.cache.size;
    this.cache.clear();

    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache CLEARED: ${size} items removed`);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { size: number; hitRate: number; items: Array<{ key: string; expiry: number; age: number }> } {
    const now = Date.now();
    const items = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      expiry: item.expiry,
      age: now - item.createdAt,
    }));

    // Calculate approximate hit rate (this is a simple approximation)
    const totalRequests = items.length * 2; // Rough estimate
    const hitRate = totalRequests > 0 ? (items.length / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      hitRate: Math.round(hitRate * 100) / 100,
      items,
    };
  }

  /**
   * Check if cache item exists and is valid
   */
  static has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    return now <= item.expiry;
  }

  /**
   * Get remaining TTL for cache item
   */
  static getTTL(key: string): number | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now > item.expiry) return 0;

    return item.expiry - now;
  }

  /**
   * Set multiple cache items at once
   */
  static setMultiple<T>(items: Array<{ key: string; data: T; ttlMs?: number }>): void {
    items.forEach(({ key, data, ttlMs }) => {
      this.set(key, data, ttlMs);
    });
  }

  /**
   * Get multiple cache items at once
   */
  static getMultiple<T>(keys: string[]): Array<{ key: string; data: T | null }> {
    return keys.map(key => ({
      key,
      data: this.get<T>(key),
    }));
  }

  /**
   * Cleanup expired items
   */
  private static cleanup(): void {
    const now = Date.now();
    let expiredCount = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        expiredCount++;
      }
    }

    if (process.env.NODE_ENV === 'development' && expiredCount > 0) {
      console.log(`Cache cleanup: ${expiredCount} expired items removed`);
    }
  }

  /**
   * Create cache key with namespace
   */
  static createKey(namespace: string, ...parts: (string | number)[]): string {
    return `${namespace}:${parts.join(':')}`;
  }

  /**
   * Cache with automatic key generation
   */
  static setWithAutoKey<T>(
    namespace: string,
    parts: (string | number)[],
    data: T,
    ttlMs?: number
  ): string {
    const key = this.createKey(namespace, ...parts);
    this.set(key, data, ttlMs);
    return key;
  }
}