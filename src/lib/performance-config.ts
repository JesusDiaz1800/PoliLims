// Configuración de optimización de rendimiento para PoliLims

export const PERFORMANCE_CONFIG = {
  // Configuración de lazy loading
  lazyLoading: {
    threshold: 100, // ms antes de cargar componentes
    rootMargin: "50px", // margen para intersection observer
    fallbackDelay: 200, // delay para mostrar fallback
  },

  // Configuración de caché
  cache: {
    dataTTL: 10 * 60 * 1000, // 10 minutos para datos
    uiTTL: 2 * 60 * 1000, // 2 minutos para UI
    chartTTL: 5 * 60 * 1000, // 5 minutos para gráficos
    maxSize: 200, // máximo items en caché
  },

  // Configuración de debounce
  debounce: {
    search: 300, // ms para búsquedas
    resize: 150, // ms para resize events
    scroll: 100, // ms para scroll events
  },

  // Configuración de virtualización
  virtualization: {
    itemHeight: 60, // altura de item en listas
    overscan: 5, // items adicionales a renderizar
    batchSize: 50, // items por batch
  },

  // Configuración de gráficos
  charts: {
    animationDuration: 1000, // duración de animaciones
    updateInterval: 5000, // intervalo de actualización
    maxDataPoints: 1000, // máximo puntos de datos
  },

  // Configuración de imágenes
  images: {
    lazyLoad: true,
    placeholder: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E",
    quality: 0.8, // calidad de imagen
  },

  // Configuración de monitoreo
  monitoring: {
    enabled: true,
    sampleRate: 0.1, // 10% de las interacciones
    maxEvents: 1000, // máximo eventos por sesión
  },
};

// Función para optimizar el rendimiento de listas grandes
export function optimizeListRendering<T>(
  items: T[],
  pageSize: number = 50
): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

// Función para optimizar cálculos costosos
export function memoizeCalculation<T>(
  calculation: () => T,
  dependencies: any[]
): T {
  const cache = new Map<string, T>();
  const key = JSON.stringify(dependencies);
  
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  
  const result = calculation();
  cache.set(key, result);
  return result;
}

// Función para optimizar el renderizado de gráficos
export function optimizeChartData(data: any[], maxPoints: number = 1000) {
  if (data.length <= maxPoints) {
    return data;
  }

  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

// Función para optimizar el tamaño de imágenes
export function optimizeImageUrl(url: string, width: number, height: number): string {
  // Aquí puedes implementar lógica para optimizar URLs de imágenes
  // Por ejemplo, agregar parámetros de tamaño o usar CDN
  return url;
}

// Función para detectar dispositivos lentos
export function isSlowDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as any).connection;
  if (connection) {
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' ||
           connection.saveData;
  }
  
  return false;
}

// Función para ajustar configuración según el dispositivo
export function getOptimizedConfig() {
  const isSlow = isSlowDevice();
  
  return {
    ...PERFORMANCE_CONFIG,
    lazyLoading: {
      ...PERFORMANCE_CONFIG.lazyLoading,
      threshold: isSlow ? 200 : 100,
    },
    charts: {
      ...PERFORMANCE_CONFIG.charts,
      animationDuration: isSlow ? 500 : 1000,
      maxDataPoints: isSlow ? 500 : 1000,
    },
  };
}

// Función para monitorear el rendimiento
export function monitorPerformance(metric: string, value: number) {
  if (!PERFORMANCE_CONFIG.monitoring.enabled) return;
  
  // Aquí puedes implementar el envío de métricas a un servicio de monitoreo
  console.log(`Performance Metric - ${metric}: ${value}ms`);
}

// Función para optimizar el bundle
export function optimizeBundle() {
  // Configuraciones para optimizar el tamaño del bundle
  return {
    treeShaking: true,
    codeSplitting: true,
    minification: true,
    compression: true,
  };
}
