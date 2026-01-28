/**
 * Sistema de prefetching de rutas optimizado para PoliLims
 */

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Rutas comunes que deberían precargarse
const commonRoutes = [
  '/dashboard',
  '/ensayos',
  '/equipos',
  '/control-rutinario',
  '/biblioteca'
];

// Rutas que requieren carga inmediata basada en el rol del usuario
const roleBasedRoutes: Record<string, string[]> = {
  admin: ['/administracion', '/auditorias'],
  supervisor: ['/control-ambiental', '/no-conformidades'],
  analista: ['/mis-evaluaciones', '/control-rutinario']
};

export function usePrefetchRoutes(userRole: string) {
  const router = useRouter();
  const currentPath = usePathname();

  const prefetchRoute = useCallback((route: string) => {
    if (route !== currentPath) {
      router.prefetch(route);
    }
  }, [currentPath, router]);

  useEffect(() => {
    // Usar requestIdleCallback para no bloquear la interactividad
    const prefetchAll = () => {
      // Primero precargar las rutas comunes
      commonRoutes.forEach(route => {
        requestIdleCallback(() => prefetchRoute(route));
      });

      // Luego precargar las rutas específicas del rol
      const rolePaths = roleBasedRoutes[userRole] || [];
      rolePaths.forEach(route => {
        requestIdleCallback(() => prefetchRoute(route));
      });
    };

    // Iniciar prefetch después de que la página esté completamente cargada
    const id = window.setTimeout(prefetchAll, 600); // pequeño delay tras mount
    return () => window.clearTimeout(id);
  }, [userRole, prefetchRoute]);
}
