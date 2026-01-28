/**
 * Sistema de precarga de datos críticos para PoliLims
 */

import { collection, query, limit, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { startMeasure, endMeasure } from './performance-monitor';

// Datos críticos que deben precargarse
const CRITICAL_COLLECTIONS = [
  { name: 'equipos', limit: 10 },
  { name: 'ensayos', limit: 10 },
  { name: 'usuarios', limit: 5 }
];

export async function prefetchCriticalData() {
  const db = getFirestoreDb();
  startMeasure('prefetch-critical-data');

  try {
    await Promise.all(
      CRITICAL_COLLECTIONS.map(async ({ name, limit: queryLimit }) => {
        startMeasure(`prefetch-${name}`);
        const q = query(collection(db, name), limit(queryLimit));
        await getDocs(q);
        endMeasure(`prefetch-${name}`);
      })
    );
  } catch (error) {
    console.error('Error prefetching critical data:', error);
  } finally {
    endMeasure('prefetch-critical-data');
  }
}

// Lista de rutas y sus datos asociados para prefetch
export const ROUTE_PREFETCH_MAP = {
  '/equipos': ['equipos', 'controles'],
  '/ensayos': ['ensayos', 'resultados'],
  '/control-rutinario': ['controles', 'equipos'],
  '/dashboard': ['estadisticas', 'alertas']
} as const;

export async function prefetchRouteData(route: keyof typeof ROUTE_PREFETCH_MAP) {
  const collections = ROUTE_PREFETCH_MAP[route];
  if (!collections) return;

  const db = getFirestoreDb();
  startMeasure(`prefetch-route-${route}`);

  try {
    await Promise.all(
      collections.map(async (collectionName) => {
        const q = query(collection(db, collectionName), limit(20));
        await getDocs(q);
      })
    );
  } catch (error) {
    console.error(`Error prefetching data for route ${route}:`, error);
  } finally {
    endMeasure(`prefetch-route-${route}`);
  }
}
