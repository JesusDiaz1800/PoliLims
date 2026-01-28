'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Rutas frecuentes que se precargarán
const COMMON_ROUTES = [
  '/dashboard',
  '/ensayos',
  '/equipos',
  '/no-conformidades',
  '/control-ambiental',
  '/importaciones',
  '/biblioteca',
  '/main',
  '/reports'
];

export function RoutePreloader() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Prefetch de rutas comunes en segundo plano
    const prefetchRoutes = async () => {
      const routesToPrefetch = COMMON_ROUTES.filter(route => route !== pathname);
      
      for (const route of routesToPrefetch) {
        try {
          await router.prefetch(route);
        } catch (error) {
          console.error(`Error prefetching ${route}:`, error);
        }
      }
    };

    // Usar requestIdleCallback para no bloquear el hilo principal
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        prefetchRoutes();
      });
    } else {
      setTimeout(prefetchRoutes, 1000);
    }
  }, [router, pathname]);

  return null;
}
