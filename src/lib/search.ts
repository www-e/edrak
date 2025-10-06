import { Prisma } from "@prisma/client";

/**
 * Generic search utility for common search patterns
 */

export interface SearchOptions {
  search?: string;
  searchFields?: string[];
}

export type SearchableWhereInput = {
  OR?: Array<Record<string, unknown>>;
};

/**
 * Creates search conditions for text fields
 */
export function createSearchConditions(
  search?: string,
  fields: string[] = ['title', 'description']
): Prisma.CourseWhereInput | Prisma.PaymentWhereInput | Prisma.CouponWhereInput {
  if (!search) return {};

  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive'
      }
    }))
  };
}

/**
 * Creates user-based search conditions for payments
 */
export function createUserSearchConditions(search?: string) {
  if (!search) return {};

  return {
    OR: [
      { user: { username: { contains: search, mode: 'insensitive' } } },
      { user: { firstName: { contains: search, mode: 'insensitive' } } },
      { user: { lastName: { contains: search, mode: 'insensitive' } } },
      { course: { title: { contains: search, mode: 'insensitive' } } }
    ]
  };
}

/**
 * Creates coupon-specific search conditions
 */
export function createCouponSearchConditions(search?: string) {
  if (!search) return {};

  return {
    OR: [
      { code: { contains: search, mode: 'insensitive' } }
    ]
  };
}

/**
 * Combines multiple search condition creators
 */
export function combineSearchConditions(
  ...conditionCreators: Array<() => Record<string, unknown>>
): Record<string, unknown> {
  const conditions = conditionCreators
    .map(creator => creator())
    .filter(condition => Object.keys(condition).length > 0);

  if (conditions.length === 0) return {};

  // Merge OR conditions from multiple creators
  const allOrConditions: Array<Record<string, unknown>> = [];
  conditions.forEach(condition => {
    if (condition.OR && Array.isArray(condition.OR)) {
      allOrConditions.push(...condition.OR);
    }
  });

  return allOrConditions.length > 0 ? { OR: allOrConditions } : {};
}