/**
 * Null-safe data transformation utilities for handling optional fields
 */

/**
 * Safely transforms optional fields to null when undefined
 */
export function transformOptionalFields<T extends Record<string, unknown>>(
  data: T,
  optionalFields: (keyof T)[]
): T {
  const transformed = { ...data };

  optionalFields.forEach(field => {
    if (transformed[field] === undefined) {
      (transformed as Record<string, unknown>)[field as string] = null;
    }
  });

  return transformed;
}

/**
 * Creates a data transformer for common optional field patterns
 */
export function createOptionalFieldTransformer<T extends Record<string, unknown>>(
  ...optionalFields: (keyof T)[]
) {
  return (data: T) => transformOptionalFields(data, optionalFields);
}

/**
 * Common transformers for specific entity types
 */
export const courseDataTransformer = createOptionalFieldTransformer(
  'categoryId'
);

export const couponDataTransformer = createOptionalFieldTransformer(
  'maxUses',
  'endDate'
);

/**
 * Safely handles nested object field access with fallbacks
 */
export function safeObjectAccess<T>(
  obj: unknown,
  accessor: (o: Record<string, unknown>) => T,
  fallback: T
): T {
  try {
    if (obj && typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      return accessor(obj as Record<string, unknown>) ?? fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Formats currency values safely
 */
export function formatCurrency(value: unknown, currency = 'EGP'): string {
  const numValue = typeof value === 'number' ? value : Number(value) || 0;
  return `${currency} ${numValue.toFixed(2)}`;
}

/**
 * Formats date values safely
 */
export function formatDate(value: unknown): string {
  if (!value) return 'N/A';

  try {
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value).toLocaleDateString();
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return 'N/A';
  } catch {
    return 'N/A';
  }
}