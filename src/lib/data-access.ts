import { createPaginationResult } from "@/lib/pagination";

/**
 * Shared data access utilities to reduce redundancy
 * Common database operation patterns used across services
 */

export class DataAccess {
  /**
   * Standardized pagination parameters
   */
  static getPaginationParams(page = 1, limit = 20) {
    return {
      page,
      limit,
      skip: (page - 1) * limit
    };
  }

  /**
   * Common user selection fields
   */
  static getUserSelect() {
    return {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
    };
  }

  /**
   * Common course selection fields
   */
  static getCourseSelect() {
    return {
      id: true,
      title: true,
      description: true,
      price: true,
      language: true,
      visibility: true,
      createdAt: true,
    };
  }

  /**
   * Common lesson selection fields
   */
  static getLessonSelect() {
    return {
      id: true,
      title: true,
      content: true,
      order: true,
      isVisible: true,
      duration: true,
      videoUrl: true,
      createdAt: true,
    };
  }

  /**
   * Common attachment selection fields
   */
  static getAttachmentSelect() {
    return {
      id: true,
      name: true,
      fileName: true,
      mimeType: true,
      fileSize: true,
      bunnyCdnUrl: true,
      createdAt: true,
    };
  }

  /**
   * Common coupon selection fields
   */
  static getCouponSelect() {
    return {
      id: true,
      code: true,
      type: true,
      amount: true,
      maxUses: true,
      usedCount: true,
      maxUsesPerUser: true,
      startDate: true,
      endDate: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  /**
   * Common payment selection fields
   */
  static getPaymentSelect() {
    return {
      id: true,
      amount: true,
      currency: true,
      status: true,
      paymentMethod: true,
      createdAt: true,
      completedAt: true,
    };
  }

  /**
   * Standardized search query builder
   */
  static buildSearchQuery(search?: string, fields: string[] = []) {
    if (!search || fields.length === 0) return {};

    return {
      OR: fields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const
        }
      }))
    };
  }

  /**
   * Common parallel query pattern for count and data
   */
  static async executeParallelQuery<T>(
    dataQuery: () => Promise<T[]>,
    countQuery: () => Promise<number>,
    page: number,
    limit: number
  ) {
    const [data, total] = await Promise.all([
      dataQuery(),
      countQuery()
    ]);

    return {
      data,
      pagination: createPaginationResult(page, limit, total)
    };
  }

  /**
   * Standardized error handling for database operations
   */
  static handleDatabaseError(error: unknown, operation: string): never {
    console.error(`Database ${operation} error:`, error);
    throw new Error(`Failed to ${operation}. Please try again.`);
  }
}