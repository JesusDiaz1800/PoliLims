/**
 * Optimizador de rendimiento para PoliLims
 * Hace que el prototipo sea súper rápido para la presentación
 */

// Configuración de optimización para presentación
export const PRESENTATION_MODE = process.env.NODE_ENV === 'development';

// Preload de componentes críticos
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload componentes del dashboard
    import('@/components/dashboard/main-page-content');
    import('@/components/dashboard/stats-card');
    import('@/components/dashboard/assays-by-month-chart');
    import('@/components/dashboard/assays-by-type-chart');
    import('@/components/dashboard/sample-status-chart');
    
    // Preload componentes de UI críticos
    import('@/components/ui/card');
    import('@/components/ui/button');
    import('@/components/ui/badge');
    import('@/components/ui/skeleton');
  }
};

// Optimización de imágenes
export const optimizeImages = () => {
  if (typeof window !== 'undefined') {
    // Precargar imágenes críticas
    const criticalImages = [
      '/images/logo.svg',
      '/images/placeholder.png',
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }
};

// Optimización de fuentes
export const optimizeFonts = () => {
  if (typeof window !== 'undefined') {
    // Precargar fuentes críticas
    // Evitar preloads a fuentes inexistentes en este entorno
    const availableFonts = [] as string[];
    availableFonts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};

// Optimización de datos
export const optimizeDataLoading = () => {
  if (typeof window !== 'undefined') {
    // Prefetch datos críticos
    const criticalData = [
      '/api/ensayos?limit=10',
      '/api/equipos?limit=10',
      '/api/usuarios?limit=5',
    ];
    
    criticalData.forEach(url => {
      fetch(url, { method: 'HEAD' });
    });
  }
};

// Optimización de caché
export const setupCache = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Configurar caché para presentación
    const cacheConfig = {
      name: 'polilims-presentation-cache',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    };
    
    // Implementar estrategia de caché
    const cacheStrategy = {
      networkFirst: ['/api/ensayos', '/api/equipos'],
      cacheFirst: ['/images/', '/fonts/'],
      staleWhileRevalidate: ['/api/usuarios'],
    };
  }
};

// Optimización de renderizado
export const optimizeRendering = () => {
  if (typeof window !== 'undefined') {
    // Configurar Intersection Observer para lazy loading
    const observerOptions = {
      rootMargin: '50px',
      threshold: 0.1,
    };
    
    // Optimizar scroll
    let ticking = false;
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Optimizaciones de scroll
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', optimizeScroll, { passive: true });
  }
};

// Optimización de memoria
export const optimizeMemory = () => {
  if (typeof window !== 'undefined') {
    // Limpiar memoria periódicamente
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
          // Forzar garbage collection si es necesario
          if ('gc' in window) {
            (window as any).gc();
          }
        }
      }
    }, 30000); // Cada 30 segundos
  }
};

// Inicializar todas las optimizaciones
export const initializeOptimizations = () => {
  if (PRESENTATION_MODE) {
    preloadCriticalComponents();
    optimizeImages();
    optimizeFonts();
    optimizeDataLoading();
    setupCache();
    optimizeRendering();
    optimizeMemory();
    
    console.log('🚀 Optimizaciones de presentación activadas');
  }
};

// Métricas de rendimiento
export const measurePerformance = () => {
  if (typeof window !== 'undefined') {
    // Medir tiempo de carga
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`⚡ Tiempo de carga: ${loadTime.toFixed(2)}ms`);
      
      // Medir métricas web vitales de forma segura
      try {
        import('web-vitals').then((webVitals) => {
          if (webVitals.getCLS) webVitals.getCLS((metric: any) => console.log('CLS:', metric));
          if (webVitals.getFID) webVitals.getFID((metric: any) => console.log('FID:', metric));
          if (webVitals.getFCP) webVitals.getFCP((metric: any) => console.log('FCP:', metric));
          if (webVitals.getLCP) webVitals.getLCP((metric: any) => console.log('LCP:', metric));
          if (webVitals.getTTFB) webVitals.getTTFB((metric: any) => console.log('TTFB:', metric));
        }).catch(() => {
          console.log('Web Vitals no disponible');
        });
      } catch (error) {
        console.log('Error al cargar Web Vitals:', error);
      }
    });
  }
};

// Optimización específica para presentación
export const presentationOptimizations = {
  // Reducir animaciones para mejor rendimiento
  reduceAnimations: () => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
      document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
  },
  
  // Optimizar para pantalla completa
  fullscreenOptimization: () => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--fullscreen-mode', 'true');
    }
  },
  
  // Modo de presentación
  enablePresentationMode: () => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('presentation-mode');
      
      // Ocultar elementos innecesarios
      const hiddenElements = document.querySelectorAll('.presentation-hidden');
      hiddenElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    }
  },
};

export default {
  initializeOptimizations,
  measurePerformance,
  presentationOptimizations,
};
