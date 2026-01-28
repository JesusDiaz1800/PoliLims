"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavigationOptimizerProps {
  children: React.ReactNode;
}

export const NavigationOptimizer = React.memo(({ children }: NavigationOptimizerProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // Cache de rutas visitadas
  const visitedRoutes = React.useRef<Set<string>>(new Set());
  const prefetchQueue = React.useRef<Set<string>>(new Set());

  // Marcar ruta actual como visitada
  React.useEffect(() => {
    if (pathname) {
      visitedRoutes.current.add(pathname);
    }
  }, [pathname]);

  // Prefetching inteligente de rutas relacionadas
  React.useEffect(() => {
    const prefetchRelatedRoutes = async () => {
      const relatedRoutes = getRelatedRoutes(pathname);
      
      for (const route of relatedRoutes) {
        if (!visitedRoutes.current.has(route) && !prefetchQueue.current.has(route)) {
          prefetchQueue.current.add(route);
          
          try {
            // Prefetch con prioridad baja para no bloquear la UI
            await router.prefetch(route);
            visitedRoutes.current.add(route);
          } catch (error) {
            console.warn(`Failed to prefetch ${route}:`, error);
          } finally {
            prefetchQueue.current.delete(route);
          }
        }
      }
    };

    // Ejecutar prefetching después de un pequeño delay
    const timeoutId = setTimeout(prefetchRelatedRoutes, 100);
    return () => clearTimeout(timeoutId);
  }, [pathname, router]);

  return <>{children}</>;
});

NavigationOptimizer.displayName = "NavigationOptimizer";

// Función para obtener rutas relacionadas basadas en la ruta actual
function getRelatedRoutes(currentPath: string): string[] {
  const routeMap: Record<string, string[]> = {
    '/dashboard': [
      '/ensayos/seguimiento',
      '/equipos',
      '/no-conformidades',
      '/auditorias',
      '/biblioteca'
    ],
    '/ensayos': [
      '/ensayos/seguimiento',
      '/ensayos/materia-prima',
      '/ensayos/tuberias',
      '/ensayos/control-rutinario'
    ],
    '/equipos': [
      '/equipos/control',
      '/equipos/programa',
      '/ensayos/seguimiento'
    ],
    '/administracion': [
      '/administracion/usuarios',
      '/administracion/permisos',
      '/administracion/configuracion'
    ]
  };

  // Encontrar la ruta base
  const baseRoute = Object.keys(routeMap).find(route => 
    currentPath.startsWith(route)
  );

  return baseRoute ? routeMap[baseRoute] : [];
}
