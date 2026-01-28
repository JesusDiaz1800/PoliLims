"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useFastNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Navegación instantánea optimizada
  const navigate = useCallback((href: string) => {
    if (isNavigating || pathname === href) return;
    
    setIsNavigating(true);
    
    // Navegación inmediata sin delays
    router.push(href);
    
    // Resetear estado más rápido
    setTimeout(() => setIsNavigating(false), 100);
  }, [router, pathname, isNavigating]);

  // Prefetch inteligente
  const prefetch = useCallback((href: string) => {
    if (pathname !== href) {
      router.prefetch(href);
    }
  }, [router, pathname]);

  // Prefetch automático de rutas comunes
  useEffect(() => {
    const commonRoutes = [
      '/ensayos',
      '/equipos',
      '/no-conformidades',
      '/capacitaciones',
      '/auditorias',
      '/reports'
    ];
    
    commonRoutes.forEach(route => {
      if (pathname !== route) {
        prefetch(route);
      }
    });
  }, [pathname, prefetch]);

  return {
    isNavigating,
    navigate,
    prefetch
  };
}
