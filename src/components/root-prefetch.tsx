
'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Routes grouped by priority for optimized loading
const ROUTES = {
  critical: [ // Instantly loaded routes
    '/main',
    '/ensayos/seguimiento',
    '/equipos',
    '/no-conformidades'
  ],
  high: [ // Fast-loading secondary routes
    '/ensayos/control-rutinario',
    '/reports/generador',
    '/biblioteca/documentos'
  ],
  normal: [ // Standard-priority routes
    '/gestion',
    '/administracion',
    '/control-ambiental',
    '/operaciones'
  ]
};

export default function RootPrefetch() {
  const router = useRouter();
  const pathname = usePathname();

  const prefetchRoutes = useCallback((routes: string[], priority: 'critical' | 'high' | 'normal') => {
    const delay = priority === 'critical' ? 0 : priority === 'high' ? 800 : 1500;
    
    setTimeout(() => {
      routes.forEach(route => {
        if (route !== pathname) { // Don't prefetch current route
          router.prefetch(route);
        }
      });
    }, delay);
  }, [router, pathname]);

  useEffect(() => {
    // Prefetch routes in order of priority with strategic delays
    prefetchRoutes(ROUTES.critical, 'critical');
    prefetchRoutes(ROUTES.high, 'high');
    prefetchRoutes(ROUTES.normal, 'normal');
  }, [prefetchRoutes]);

  return null;
}
