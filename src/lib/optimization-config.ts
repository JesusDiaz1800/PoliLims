/**
 * Configuración de optimización para PoliLims
 * Sistema de optimización ultra-rápido para el mejor LIMS del mundo
 */

export const OPTIMIZATION_CONFIG = {
  // Configuración de caché
  CACHE: {
    // Tiempo de vida del caché en milisegundos
    TTL: {
      SHORT: 5 * 60 * 1000, // 5 minutos
      MEDIUM: 30 * 60 * 1000, // 30 minutos
      LONG: 24 * 60 * 60 * 1000, // 24 horas
      PERMANENT: 365 * 24 * 60 * 60 * 1000, // 1 año
    },
    
    // Estrategias de caché
    STRATEGIES: {
      NETWORK_FIRST: ['/api/ensayos', '/api/equipos', '/api/usuarios'],
      CACHE_FIRST: ['/images/', '/fonts/', '/static/'],
      STALE_WHILE_REVALIDATE: ['/api/dashboard', '/api/reports'],
    },
    
    // Tamaño máximo del caché
    MAX_SIZE: 100 * 1024 * 1024, // 100MB
  },

  // Configuración de preload
  PRELOAD: {
    // Componentes críticos para preload
    CRITICAL_COMPONENTS: [
      '@/components/dashboard/main-page-content',
      '@/components/dashboard/stats-card',
      '@/components/ui/card',
      '@/components/ui/button',
      '@/components/ui/badge',
    ],
    
    // Imágenes críticas
    CRITICAL_IMAGES: [
      '/images/logo.svg',
      '/images/placeholder.png',
    ],
    
    // Fuentes críticas
    CRITICAL_FONTS: [
      '/fonts/inter-var.woff2',
    ],
    
    // Datos críticos
    CRITICAL_DATA: [
      '/api/ensayos?limit=10',
      '/api/equipos?limit=10',
      '/api/usuarios?limit=5',
    ],
  },

  // Configuración de lazy loading
  LAZY_LOADING: {
    // Umbral de intersección para lazy loading
    INTERSECTION_THRESHOLD: 0.1,
    
    // Margen de raíz para lazy loading
    ROOT_MARGIN: '50px',
    
    // Componentes para lazy loading
    LAZY_COMPONENTS: [
      '@/components/reports/coa-report',
      '@/components/reports/materia-prima-report',
      '@/components/reports/ProductHistoryReport',
      '@/components/reports/SummaryReport',
    ],
  },

  // Configuración de compresión
  COMPRESSION: {
    // Nivel de compresión para diferentes tipos de archivo
    LEVELS: {
      HTML: 6,
      CSS: 6,
      JS: 6,
      JSON: 6,
      IMAGES: 8,
    },
    
    // Tipos de archivo a comprimir
    TYPES: [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'image/svg+xml',
    ],
  },

  // Configuración de métricas
  METRICS: {
    // Umbrales de rendimiento
    THRESHOLDS: {
      FIRST_CONTENTFUL_PAINT: 1000, // 1 segundo
      LARGEST_CONTENTFUL_PAINT: 2500, // 2.5 segundos
      FIRST_INPUT_DELAY: 100, // 100ms
      CUMULATIVE_LAYOUT_SHIFT: 0.1, // 0.1
    },
    
    // Métricas a rastrear
    TRACKED_METRICS: [
      'FCP', // First Contentful Paint
      'LCP', // Largest Contentful Paint
      'FID', // First Input Delay
      'CLS', // Cumulative Layout Shift
      'TTFB', // Time to First Byte
    ],
  },

  // Configuración de memoria
  MEMORY: {
    // Límite de memoria para limpieza automática
    CLEANUP_THRESHOLD: 0.8, // 80% del heap
    
    // Intervalo de limpieza de memoria
    CLEANUP_INTERVAL: 30000, // 30 segundos
    
    // Componentes para limpiar de memoria
    CLEANUP_COMPONENTS: [
      'Chart',
      'DataTable',
      'Modal',
      'Dialog',
    ],
  },

  // Configuración de navegación
  NAVIGATION: {
    // Prefetch de rutas
    PREFETCH_ROUTES: [
      '/dashboard',
      '/ensayos',
      '/equipos',
      '/reports',
    ],
    
    // Rutas críticas para preload
    CRITICAL_ROUTES: [
      '/dashboard',
    ],
    
    // Estrategia de navegación
    STRATEGY: 'HYBRID', // 'HYBRID' | 'SPA' | 'SSR'
  },

  // Configuración de imágenes
  IMAGES: {
    // Formatos soportados
    FORMATS: ['image/webp', 'image/avif', 'image/jpeg', 'image/png'],
    
    // Tamaños de dispositivo
    DEVICE_SIZES: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Tamaños de imagen
    IMAGE_SIZES: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Tiempo de vida del caché de imágenes
    CACHE_TTL: 31536000, // 1 año
  },

  // Configuración de base de datos
  DATABASE: {
    // Tamaño del pool de conexiones
    CONNECTION_POOL_SIZE: 10,
    
    // Tiempo de espera de conexión
    CONNECTION_TIMEOUT: 5000, // 5 segundos
    
    // Tiempo de espera de consulta
    QUERY_TIMEOUT: 10000, // 10 segundos
    
    // Estrategia de caché de consultas
    QUERY_CACHE_STRATEGY: 'LRU', // 'LRU' | 'FIFO' | 'LFU'
    
    // Tamaño máximo del caché de consultas
    QUERY_CACHE_SIZE: 1000,
  },

  // Configuración de seguridad
  SECURITY: {
    // Headers de seguridad
    SECURITY_HEADERS: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    
    // Configuración de CORS
    CORS: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  },

  // Configuración de monitoreo
  MONITORING: {
    // Intervalo de monitoreo de rendimiento
    PERFORMANCE_INTERVAL: 5000, // 5 segundos
    
    // Métricas a monitorear
    PERFORMANCE_METRICS: [
      'memory',
      'cpu',
      'network',
      'rendering',
    ],
    
    // Umbrales de alerta
    ALERT_THRESHOLDS: {
      MEMORY_USAGE: 0.9, // 90%
      CPU_USAGE: 0.8, // 80%
      NETWORK_LATENCY: 1000, // 1 segundo
    },
  },

  // Configuración de desarrollo
  DEVELOPMENT: {
    // Modo de desarrollo
    DEV_MODE: process.env.NODE_ENV === 'development',
    
    // Optimizaciones para desarrollo
    DEV_OPTIMIZATIONS: {
      HOT_RELOAD: true,
      FAST_REFRESH: true,
      SOURCE_MAPS: true,
      BUNDLE_ANALYZER: false,
    },
  },

  // Configuración de producción
  PRODUCTION: {
    // Optimizaciones para producción
    PROD_OPTIMIZATIONS: {
      MINIFICATION: true,
      TREE_SHAKING: true,
      CODE_SPLITTING: true,
      COMPRESSION: true,
      CACHING: true,
    },
    
    // Configuración de CDN
    CDN: {
      ENABLED: true,
      DOMAIN: process.env.NEXT_PUBLIC_CDN_DOMAIN,
      PATHS: ['/images/', '/fonts/', '/static/'],
    },
  },
};

// Funciones de utilidad para optimización
export const OPTIMIZATION_UTILS = {
  // Verificar si el navegador soporta características modernas
  supportsModernFeatures: () => {
    if (typeof window === 'undefined') return false;
    
    return {
      webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
      avif: false, // Verificar soporte de AVIF
      webgl: !!window.WebGLRenderingContext,
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      requestIdleCallback: 'requestIdleCallback' in window,
    };
  },

  // Calcular score de rendimiento
  calculatePerformanceScore: (metrics: any) => {
    const weights = {
      FCP: 0.2,
      LCP: 0.25,
      FID: 0.25,
      CLS: 0.15,
      TTFB: 0.15,
    };

    let score = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      if (metrics[metric] !== undefined) {
        const normalizedScore = Math.max(0, 1 - (metrics[metric] / OPTIMIZATION_CONFIG.METRICS.THRESHOLDS[metric as keyof typeof OPTIMIZATION_CONFIG.METRICS.THRESHOLDS]));
        score += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? score / totalWeight : 0;
  },

  // Optimizar imágenes
  optimizeImage: (src: string, width: number, height: number, quality: number = 80) => {
    // Implementar optimización de imágenes
    return src;
  },

  // Preload recursos
  preloadResource: (href: string, as: string) => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  // Lazy load componente
  lazyLoadComponent: (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
    const React = require('react');
    return React.lazy(importFn);
  },

  // Debounce función
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // Throttle función
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
};

export default OPTIMIZATION_CONFIG;
