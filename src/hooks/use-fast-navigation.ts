"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useRef, useEffect, useState } from "react";

interface NavigationCache {
  [key: string]: {
    timestamp: number;
    data: any;
  };
}

export const useFastNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const navigationCache = useRef<NavigationCache>({});
  const prefetchQueue = useRef<Set<string>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);

  // Limpiar cache antiguo (más de 5 minutos)
  useEffect(() => {
    const now = Date.now();
    const cacheTimeout = 5 * 60 * 1000; // 5 minutos

    Object.keys(navigationCache.current).forEach(key => {
      if (now - navigationCache.current[key].timestamp > cacheTimeout) {
        delete navigationCache.current[key];
      }
    });
  }, [pathname]);

  // Prefetch inteligente de rutas relacionadas
  const prefetchRoute = useCallback(async (route: string) => {
    if (prefetchQueue.current.has(route) || navigationCache.current[route]) {
      return;
    }

    prefetchQueue.current.add(route);

    try {
      // Prefetch con prioridad baja
      await router.prefetch(route);
      
      // Marcar como prefetcheado
      navigationCache.current[route] = {
        timestamp: Date.now(),
        data: { prefetched: true }
      };
    } catch (error) {
      console.warn(`Failed to prefetch ${route}:`, error);
    } finally {
      prefetchQueue.current.delete(route);
    }
  }, [router]);

  // Navegación ultra-optimizada para presentación
  const navigateTo = useCallback(async (route: string, options?: { 
    replace?: boolean; 
    scroll?: boolean;
    shallow?: boolean;
  }) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    try {
      // Navegación inmediata para máxima velocidad
      if (options?.replace) {
        router.replace(route);
      } else {
        router.push(route);
      }
      
      // Prefetch en background después de navegar
      setTimeout(() => {
        prefetchRoute(route);
      }, 50);
      
    } catch (error) {
      console.error(`Navigation error to ${route}:`, error);
    } finally {
      // Resetear estado más rápido
      setTimeout(() => {
        setIsNavigating(false);
      }, 50);
    }
  }, [router, prefetchRoute, isNavigating]);

  // Prefetch de rutas relacionadas basado en la ruta actual
  const prefetchRelatedRoutes = useCallback(() => {
    const relatedRoutes = getRelatedRoutes(pathname);
    
    relatedRoutes.forEach(route => {
      if (route !== pathname) {
        prefetchRoute(route);
      }
    });
  }, [pathname, prefetchRoute]);

  // Ejecutar prefetch de rutas relacionadas cuando cambia la ruta
  useEffect(() => {
    const timeoutId = setTimeout(prefetchRelatedRoutes, 1000); // Aumentar delay a 1 segundo
    return () => clearTimeout(timeoutId);
  }, [prefetchRelatedRoutes]);

  return {
    navigateTo,
    prefetchRoute,
    prefetchRelatedRoutes,
    isNavigating,
    cache: navigationCache.current
  };
};

// Función para obtener rutas relacionadas
function getRelatedRoutes(currentPath: string): string[] {
  const routeMap: Record<string, string[]> = {
    '/dashboard': [
      '/ensayos/seguimiento',
      '/equipos',
      '/no-conformidades',
      '/auditorias',
      '/biblioteca',
      '/administracion'
    ],
    '/ensayos': [
      '/ensayos/seguimiento',
      '/ensayos/materia-prima',
      '/ensayos/tuberias',
      '/ensayos/control-rutinario',
      '/ensayos/reprocesado'
    ],
    '/equipos': [
      '/equipos/control',
      '/equipos/programa',
      '/ensayos/seguimiento'
    ],
    '/administracion': [
      '/administracion/usuarios',
      '/administracion/permisos',
      '/administracion/configuracion',
      '/administracion/capacitaciones'
    ],
    '/biblioteca': [
      '/biblioteca/documentos',
      '/biblioteca/upload'
    ],
    '/auditorias': [
      '/auditorias',
      '/no-conformidades'
    ]
  };

  // Encontrar la ruta base
  const baseRoute = Object.keys(routeMap).find(route => 
    currentPath.startsWith(route)
  );

  return baseRoute ? routeMap[baseRoute] : [];
}
