
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Prefetch critical routes to make navigation feel instant
const hotRoutes = [
    '/main',
    '/ensayos/seguimiento',
    '/ensayos/control-rutinario',
    '/reports/generador',
    '/equipos',
    '/no-conformidades',
    '/biblioteca/documentos',
    '/gestion',
    '/administracion'
];

export default function RootPrefetch() {
  const router = useRouter();

  useEffect(() => {
    hotRoutes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  return null;
}
