
/**
 * Common admin router patterns to reduce duplication
 * Use these utilities in your routers instead of rewriting common patterns
 */

/**
 * Standard list query handler with pagination and search
 */
export function createListHandler<T extends Record<string, unknown>>(
  service: { getAllItems: (options?: unknown) => Promise<{ data: T[]; pagination: unknown }> }
) {
  return async (input?: { page?: number; limit?: number; search?: string }) => {
    return service.getAllItems(input);
  };
}

/**
 * Standard get by ID handler
 */
export function createGetByIdHandler<T extends Record<string, unknown>>(
  service: { getItemById: (id: string) => Promise<T | null> }
) {
  return async (input: { id: string }) => {
    return service.getItemById(input.id);
  };
}

/**
 * Standard create handler
 */
export function createCreateHandler<T extends Record<string, unknown>>(
  service: { createItem: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T> }
) {
  return async (input: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    return service.createItem(input);
  };
}

/**
 * Standard update handler
 */
export function createUpdateHandler<T extends Record<string, unknown>>(
  service: { updateItem: (data: Partial<T> & { id: string }) => Promise<T> }
) {
  return async (input: Partial<T> & { id: string }) => {
    return service.updateItem(input);
  };
}