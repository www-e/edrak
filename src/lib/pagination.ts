/**
 * Generic pagination utility to eliminate duplication across service methods
 */

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResult;
}

/**
 * Creates standardized pagination result object
 */
export function createPaginationResult(
  page: number,
  limit: number,
  total: number
): PaginationResult {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  };
}

/**
 * Extracts pagination parameters with defaults
 */
export function getPaginationParams(options?: PaginationOptions) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Generic pagination wrapper for database queries
 */
export async function withPagination<T>(
  query: () => Promise<T[]>,
  countQuery: () => Promise<number>,
  options?: PaginationOptions
): Promise<PaginatedResponse<T>> {
  const { page, limit } = getPaginationParams(options);

  const [data, total] = await Promise.all([
    query(),
    countQuery()
  ]);

  return {
    data,
    pagination: createPaginationResult(page, limit, total)
  };
}