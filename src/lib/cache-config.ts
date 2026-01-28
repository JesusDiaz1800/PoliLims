export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
};

export function createQueryKey(path: string, params?: Record<string, any>) {
  return [path, params];
}

export function createCacheKey(entityType: string, id: string) {
  return `${entityType}:${id}`;
}

// Firebase batch operations helper
export async function batchOperations<T>(
  items: T[],
  operation: (item: T) => Promise<void>,
  batchSize = 500
) {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize).map(operation);
    batches.push(batch);
  }
  
  await Promise.all(batches.map(batch => Promise.all(batch)));
}
