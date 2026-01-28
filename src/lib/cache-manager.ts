interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly defaultMaxSize = 100;

  constructor(private options: CacheOptions = {}) {
    this.options.ttl = options.ttL || this.defaultTTL;
    this.options.maxSize = options.maxSize || this.defaultMaxSize;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Limpiar caché si está lleno
    if (this.cache.size >= this.options.maxSize!) {
      this.cleanup();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl!
    };

    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Verificar si el item ha expirado
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    
    return Date.now() - item.timestamp > item.ttl;
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Encontrar items expirados
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        expiredKeys.push(key);
      }
    }

    // Eliminar items expirados
    expiredKeys.forEach(key => this.cache.delete(key));

    // Si aún está lleno, eliminar los más antiguos
    if (this.cache.size >= this.options.maxSize!) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, Math.floor(this.options.maxSize! / 2));
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Instancias de caché para diferentes tipos de datos
export const dataCache = new CacheManager({ ttl: 10 * 60 * 1000, maxSize: 200 }); // 10 minutos
export const uiCache = new CacheManager({ ttl: 2 * 60 * 1000, maxSize: 50 }); // 2 minutos
export const chartCache = new CacheManager({ ttl: 5 * 60 * 1000, maxSize: 30 }); // 5 minutos

// Hook para usar caché en componentes React
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cache: CacheManager = dataCache
): { data: T | null; loading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const [data, setData] = React.useState<T | null>(cache.get(key));
  const [loading, setLoading] = React.useState(!cache.has(key));
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetcher();
      cache.set(key, result);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, cache]);

  React.useEffect(() => {
    if (!cache.has(key)) {
      fetchData();
    }
  }, [key, cache, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Función para limpiar caché automáticamente
export function setupCacheCleanup(): void {
  setInterval(() => {
    dataCache['cleanup']();
    uiCache['cleanup']();
    chartCache['cleanup']();
  }, 60000); // Limpiar cada minuto
}

// Función para precargar datos importantes
export async function preloadCriticalData(): Promise<void> {
  // Aquí puedes agregar la precarga de datos críticos
  console.log('Precargando datos críticos...');
}

export default CacheManager;
