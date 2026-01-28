"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { OPTIMIZATION_CONFIG, OPTIMIZATION_UTILS } from '@/lib/optimization-config';

/**
 * Componente de optimización de rendimiento ultra-avanzado para PoliLims
 * Implementa las mejores prácticas de optimización para el mejor LIMS del mundo
 */
export function PerformanceOptimizerClient() {
  const performanceRef = useRef<{
    metrics: Record<string, number>;
    startTime: number;
    observers: Set<IntersectionObserver>;
  }>({
    metrics: {},
    startTime: Date.now(),
    observers: new Set(),
  });

  // Inicializar métricas de rendimiento
  const initializePerformanceMetrics = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Medir tiempo de carga inicial
    performanceRef.current.startTime = performance.now();

    // Configurar observadores de métricas web vitales
    const setupWebVitals = async () => {
      try {
        const webVitals = await import('web-vitals');
        
        // First Contentful Paint
        if (webVitals.getFCP) {
          webVitals.getFCP((metric: any) => {
            performanceRef.current.metrics.FCP = metric.value;
            console.log('🎨 FCP:', metric.value, 'ms');
          });
        }

        // Largest Contentful Paint
        if (webVitals.getLCP) {
          webVitals.getLCP((metric: any) => {
            performanceRef.current.metrics.LCP = metric.value;
            console.log('📊 LCP:', metric.value, 'ms');
          });
        }

        // First Input Delay
        if (webVitals.getFID) {
          webVitals.getFID((metric: any) => {
            performanceRef.current.metrics.FID = metric.value;
            console.log('⚡ FID:', metric.value, 'ms');
          });
        }

        // Cumulative Layout Shift
        if (webVitals.getCLS) {
          webVitals.getCLS((metric: any) => {
            performanceRef.current.metrics.CLS = metric.value;
            console.log('📐 CLS:', metric.value);
          });
        }

        // Time to First Byte
        if (webVitals.getTTFB) {
          webVitals.getTTFB((metric: any) => {
            performanceRef.current.metrics.TTFB = metric.value;
            console.log('🌐 TTFB:', metric.value, 'ms');
          });
        }
      } catch (error) {
        console.log('Web Vitals no disponible:', error);
      }
    };

    setupWebVitals();
  }, []);

  // Optimizar carga de imágenes
  const optimizeImages = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Lazy loading de imágenes
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    // Observar todas las imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });

    performanceRef.current.observers.add(imageObserver);
  }, []);

  // Optimizar carga de componentes
  const optimizeComponents = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Lazy loading de componentes
    const componentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const component = entry.target as HTMLElement;
            const componentType = component.dataset.component;
            
            if (componentType) {
              // Cargar componente dinámicamente
              import(`@/components/${componentType}`).then((module) => {
                console.log(`📦 Componente cargado: ${componentType}`);
              });
              
              componentObserver.unobserve(component);
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    // Observar componentes con data-component
    document.querySelectorAll('[data-component]').forEach((component) => {
      componentObserver.observe(component);
    });

    performanceRef.current.observers.add(componentObserver);
  }, []);

  // Optimizar navegación
  const optimizeNavigation = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Prefetch de rutas críticas
    const prefetchRoutes = OPTIMIZATION_CONFIG.NAVIGATION.PREFETCH_ROUTES;
    
    prefetchRoutes.forEach((route) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // Optimizar enlaces internos
    document.addEventListener('mouseenter', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && (target as HTMLAnchorElement).href.includes(window.location.origin)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = (target as HTMLAnchorElement).href;
        document.head.appendChild(link);
      }
    }, { passive: true });
  }, []);

  // Optimizar memoria
  const optimizeMemory = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Limpiar memoria periódicamente
    const memoryCleanup = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

        if (usage > OPTIMIZATION_CONFIG.MEMORY.CLEANUP_THRESHOLD) {
          console.log('🧹 Limpieza de memoria iniciada');
          
          // Limpiar caché de imágenes
          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                if (cacheName.includes('image')) {
                  caches.delete(cacheName);
                }
              });
            });
          }

          // Forzar garbage collection si está disponible
          if ('gc' in window) {
            (window as any).gc();
          }
        }
      }
    }, OPTIMIZATION_CONFIG.MEMORY.CLEANUP_INTERVAL);

    return () => clearInterval(memoryCleanup);
  }, []);

  // Optimizar scroll
  const optimizeScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Optimizaciones de scroll
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  // Preload recursos críticos
  const preloadCriticalResources = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Preload fuentes críticas
    OPTIMIZATION_CONFIG.PRELOAD.CRITICAL_FONTS.forEach((font) => {
      OPTIMIZATION_UTILS.preloadResource(font, 'font');
    });

    // Preload imágenes críticas
    OPTIMIZATION_CONFIG.PRELOAD.CRITICAL_IMAGES.forEach((image) => {
      OPTIMIZATION_UTILS.preloadResource(image, 'image');
    });

    // Preload datos críticos
    OPTIMIZATION_CONFIG.PRELOAD.CRITICAL_DATA.forEach((data) => {
      OPTIMIZATION_UTILS.preloadResource(data, 'fetch');
    });
  }, []);

  // Configurar Service Worker
  const setupServiceWorker = useCallback(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    // Registrar SW solo en producción para evitar conflictos HMR
    if (process.env.NODE_ENV !== 'production') return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('🔧 Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('❌ Error al registrar Service Worker:', error);
      });
  }, []);

  // Monitorear rendimiento
  const monitorPerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Monitorear métricas de rendimiento
    const performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          performanceRef.current.metrics.navigation = navEntry.loadEventEnd - navEntry.loadEventStart;
        }
      });
    });

    performanceObserver.observe({ entryTypes: ['navigation', 'resource'] });

    // Monitorear uso de memoria
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        if (usage > 80) {
          console.warn('⚠️ Uso de memoria alto:', usage.toFixed(1) + '%');
        }
      }, 10000);
    }

    return () => performanceObserver.disconnect();
  }, []);

  // Efecto principal de optimización
  useEffect(() => {
    console.log('🚀 Iniciando optimizaciones de rendimiento...');

    // Inicializar métricas
    initializePerformanceMetrics();

    // Preload recursos críticos
    preloadCriticalResources();

    // Configurar Service Worker
    setupServiceWorker();

    // Optimizaciones después de la carga inicial
    const loadHandler = () => {
      optimizeImages();
      optimizeComponents();
      optimizeNavigation();
      optimizeMemory();
      optimizeScroll();
      monitorPerformance();

      // Calcular score de rendimiento final
      setTimeout(() => {
        const score = OPTIMIZATION_UTILS.calculatePerformanceScore(performanceRef.current.metrics);
        console.log(`🏆 Score de rendimiento: ${(score * 100).toFixed(1)}/100`);
      }, 2000);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadHandler);
    } else {
      loadHandler();
    }

    // Cleanup
    return () => {
      performanceRef.current.observers.forEach((observer) => {
        observer.disconnect();
      });
      performanceRef.current.observers.clear();
    };
  }, [
    initializePerformanceMetrics,
    preloadCriticalResources,
    setupServiceWorker,
    optimizeImages,
    optimizeComponents,
    optimizeNavigation,
    optimizeMemory,
    optimizeScroll,
    monitorPerformance,
  ]);

  // Componente invisible - solo maneja optimizaciones
  return null;
}

export default PerformanceOptimizerClient;
