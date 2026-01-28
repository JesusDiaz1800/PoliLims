/**
 * Service Worker ultra-optimizado para PoliLims
 * Sistema de caché inteligente para el mejor LIMS del mundo
 */

const CACHE_NAME = 'polilims-v1.0.0';
const STATIC_CACHE = 'polilims-static-v1.0.0';
const DYNAMIC_CACHE = 'polilims-dynamic-v1.0.0';
const API_CACHE = 'polilims-api-v1.0.0';

// Recursos críticos para caché inmediato
const CRITICAL_RESOURCES = [
  '/',
  '/dashboard',
  // Recursos reales gestionados por Next.js. Evitar rutas inexistentes que causan 404
  '/_next/static/',
  '/images/logo.svg',
];

// Recursos estáticos para caché
const STATIC_RESOURCES = [
  '/images/',
  '/fonts/',
  '/static/',
  '/_next/static/',
];

// Rutas de API para caché
const API_ROUTES = [
  '/api/ensayos',
  '/api/equipos',
  '/api/usuarios',
  '/api/dashboard',
];

// Estrategias de caché
const CACHE_STRATEGIES = {
  // Caché primero para recursos estáticos
  CACHE_FIRST: async (request) => {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      return new Response('Recurso no disponible', { status: 404 });
    }
  },

  // Red primero para datos dinámicos
  NETWORK_FIRST: async (request) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response('Sin conexión', { status: 503 });
    }
  },

  // Stale while revalidate para datos semi-estáticos
  STALE_WHILE_REVALIDATE: async (request) => {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
  },
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  
  event.waitUntil(
    Promise.all([
      // Caché de recursos críticos
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Precargar recursos importantes
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.addAll([
          '/api/ensayos?limit=10',
          '/api/equipos?limit=10',
        ]);
      }),
    ])
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              console.log('🗑️ Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar control inmediatamente
      self.clients.claim(),
    ])
  );
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar peticiones HTTP/HTTPS
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }
  
  // Estrategia según el tipo de recurso
  if (STATIC_RESOURCES.some(resource => url.pathname.startsWith(resource))) {
    // Recursos estáticos: Cache First
    event.respondWith(CACHE_STRATEGIES.CACHE_FIRST(request));
  } else if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    // APIs: Stale While Revalidate
    event.respondWith(CACHE_STRATEGIES.STALE_WHILE_REVALIDATE(request));
  } else if (url.pathname.startsWith('/api/')) {
    // Otras APIs: Network First
    event.respondWith(CACHE_STRATEGIES.NETWORK_FIRST(request));
  } else {
    // Páginas: Network First con fallback
    event.respondWith(CACHE_STRATEGIES.NETWORK_FIRST(request));
  }
});

// Manejo de mensajes
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      });
      break;
      
    case 'GET_CACHE_INFO':
      caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map(async (cacheName) => {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return { name: cacheName, size: keys.length };
          })
        ).then((info) => {
          event.ports[0].postMessage(info);
        });
      });
      break;
      
    case 'PRECACHE_RESOURCE':
      const { url, strategy } = data;
      const request = new Request(url);
      
      if (strategy === 'static') {
        CACHE_STRATEGIES.CACHE_FIRST(request);
      } else if (strategy === 'dynamic') {
        CACHE_STRATEGIES.NETWORK_FIRST(request);
      }
      break;
  }
});

// Manejo de errores
self.addEventListener('error', (event) => {
  console.error('❌ Error en Service Worker:', event.error);
});

// Manejo de rechazos de promesas
self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promesa rechazada en Service Worker:', event.reason);
});

// Optimizaciones de rendimiento
const PERFORMANCE_OPTIMIZATIONS = {
  // Comprimir respuestas
  compressResponse: async (response) => {
    if (response.headers.get('content-type')?.includes('text/')) {
      const text = await response.text();
      const compressed = new TextEncoder().encode(text);
      return new Response(compressed, {
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'content-encoding': 'gzip',
        },
      });
    }
    return response;
  },

  // Validar caché
  validateCache: async (cache, request) => {
    const response = await cache.match(request);
    if (response) {
      const cacheTime = response.headers.get('sw-cache-time');
      if (cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000) {
        return response;
      }
    }
    return null;
  },

  // Limpiar caché antiguo
  cleanupOldCache: async () => {
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    // Mantener solo los últimos 100 elementos
    if (keys.length > 100) {
      const toDelete = keys.slice(0, keys.length - 100);
      await Promise.all(toDelete.map(key => cache.delete(key)));
    }
  },
};

// Ejecutar limpieza periódica
setInterval(() => {
  PERFORMANCE_OPTIMIZATIONS.cleanupOldCache();
}, 10 * 60 * 1000); // Cada 10 minutos

console.log('🔧 Service Worker de PoliLims cargado');
