/**
 * Configuración de la API para conectar con el backend Django
 */

// Configuración base de la API
export const API_CONFIG = {
  // URL base del backend Django
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  
  // Endpoints principales
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/api/auth/login/',
      LOGOUT: '/api/auth/logout/',
      REFRESH: '/api/auth/refresh/',
      PROFILE: '/api/auth/profile/',
    },
    
    // Dashboard
    DASHBOARD: {
      STATS: '/api/dashboard/stats/',
      METRICS: '/api/dashboard/metrics/',
      RECENT_ACTIVITY: '/api/dashboard/recent-activity/',
    },
    
    // Ensayos
    ENSAYOS: {
      LIST: '/api/ensayos/',
      DETAIL: (id: string) => `/api/ensayos/${id}/`,
      CREATE: '/api/ensayos/create/',
      UPDATE: (id: string) => `/api/ensayos/${id}/update/`,
      DELETE: (id: string) => `/api/ensayos/${id}/delete/`,
      APROBAR: (id: string) => `/api/ensayos/${id}/aprobar/`,
      MUESTRAS: '/api/ensayos/muestras/',
      RESULTADOS: '/api/ensayos/resultados/',
      HISTORIAL: (id: string) => `/api/ensayos/${id}/historial/`,
    },
    
    // Equipos
    EQUIPOS: {
      LIST: '/api/equipos/',
      DETAIL: (id: string) => `/api/equipos/${id}/`,
      CREATE: '/api/equipos/create/',
      UPDATE: (id: string) => `/api/equipos/${id}/update/`,
      DELETE: (id: string) => `/api/equipos/${id}/delete/`,
      CALIBRACIONES: '/api/equipos/calibraciones/',
      MANTENIMIENTOS: '/api/equipos/mantenimientos/',
      EVENTOS: '/api/equipos/eventos/',
    },
    
    // Proveedores
    PROVEEDORES: {
      LIST: '/api/proveedores/',
      DETAIL: (id: string) => `/api/proveedores/${id}/`,
      CREATE: '/api/proveedores/create/',
      UPDATE: (id: string) => `/api/proveedores/${id}/update/`,
      DELETE: (id: string) => `/api/proveedores/${id}/delete/`,
      EVALUACIONES: '/api/proveedores/evaluaciones/',
      AUDITORIAS: '/api/proveedores/auditorias/',
    },
    
    // Calidad
    CALIDAD: {
      NO_CONFORMIDADES: '/api/calidad/no-conformidades/',
      ACCIONES_CORRECTIVAS: '/api/calidad/acciones-correctivas/',
      AUDITORIAS: '/api/calidad/auditorias/',
      CONDICIONES_AMBIENTALES: '/api/calidad/condiciones-ambientales/',
    },
    
    // Reportes
    REPORTES: {
      LIST: '/api/reportes/',
      ENSAYOS: '/api/reportes/ensayos/',
      EQUIPOS: '/api/reportes/equipos/',
      PROVEEDORES: '/api/reportes/proveedores/',
      CALIDAD: '/api/reportes/calidad/',
      EXPORT: {
        ENSAYOS: '/api/reportes/export/ensayos/',
        EQUIPOS: '/api/reportes/export/equipos/',
        PROVEEDORES: '/api/reportes/export/proveedores/',
      },
    },
    
    // Utilidades
    UTILS: {
      SEARCH: '/api/search/',
      UPLOAD: '/api/upload/',
      HEALTH: '/api/health/',
    },
  },
  
  // Configuración de headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de timeout
  TIMEOUT: 30000, // 30 segundos
  
  // Configuración de reintentos
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 segundo
  },
};

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Configuración de autenticación
export const AUTH_CONFIG = {
  // Almacenamiento de tokens
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'polilims_access_token',
    REFRESH_TOKEN: 'polilims_refresh_token',
    USER_PROFILE: 'polilims_user_profile',
  },
  
  // Configuración de JWT
  JWT_CONFIG: {
    // Tiempo de expiración del token de acceso (en segundos)
    ACCESS_TOKEN_EXPIRY: 3600, // 1 hora
    
    // Tiempo de expiración del token de refresco (en segundos)
    REFRESH_TOKEN_EXPIRY: 604800, // 7 días
    
    // Tiempo de tolerancia para renovar el token (en segundos)
    TOKEN_RENEWAL_THRESHOLD: 300, // 5 minutos
  },
};

// Configuración de caché
export const CACHE_CONFIG = {
  // Tiempo de vida del caché (en milisegundos)
  TTL: {
    DASHBOARD_STATS: 5 * 60 * 1000, // 5 minutos
    ENSAYOS_LIST: 2 * 60 * 1000, // 2 minutos
    EQUIPOS_LIST: 5 * 60 * 1000, // 5 minutos
    PROVEEDORES_LIST: 10 * 60 * 1000, // 10 minutos
    USER_PROFILE: 30 * 60 * 1000, // 30 minutos
  },
  
  // Claves de caché
  KEYS: {
    DASHBOARD_STATS: 'dashboard_stats',
    ENSAYOS_LIST: 'ensayos_list',
    EQUIPOS_LIST: 'equipos_list',
    PROVEEDORES_LIST: 'proveedores_list',
    USER_PROFILE: 'user_profile',
  },
};

// Configuración de errores
export const ERROR_CONFIG = {
  // Códigos de error comunes
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    SERVER_ERROR: 500,
    NETWORK_ERROR: 0,
  },
  
  // Mensajes de error
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Error de conexión. Verifique su conexión a internet.',
    UNAUTHORIZED: 'No autorizado. Por favor inicie sesión.',
    FORBIDDEN: 'Acceso denegado. No tiene permisos para esta acción.',
    NOT_FOUND: 'Recurso no encontrado.',
    SERVER_ERROR: 'Error del servidor. Intente más tarde.',
    VALIDATION_ERROR: 'Datos inválidos. Verifique la información ingresada.',
  },
};

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  // Tipos de notificación
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
  
  // Duración de las notificaciones (en milisegundos)
  DURATION: {
    SUCCESS: 3000, // 3 segundos
    ERROR: 5000, // 5 segundos
    WARNING: 4000, // 4 segundos
    INFO: 3000, // 3 segundos
  },
};

// Configuración de paginación
export const PAGINATION_CONFIG = {
  // Tamaño de página por defecto
  DEFAULT_PAGE_SIZE: 20,
  
  // Opciones de tamaño de página
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  
  // Configuración de navegación
  NAVIGATION: {
    SHOW_FIRST_LAST: true,
    SHOW_PREV_NEXT: true,
    MAX_VISIBLE_PAGES: 5,
  },
};

// Configuración de filtros
export const FILTER_CONFIG = {
  // Operadores de filtro
  OPERATORS: {
    EQUALS: 'exact',
    CONTAINS: 'icontains',
    STARTS_WITH: 'istartswith',
    ENDS_WITH: 'iendswith',
    GREATER_THAN: 'gt',
    LESS_THAN: 'lt',
    GREATER_EQUAL: 'gte',
    LESS_EQUAL: 'lte',
    IN: 'in',
    NOT_IN: 'not_in',
    IS_NULL: 'isnull',
    IS_NOT_NULL: 'isnotnull',
  },
  
  // Configuración de búsqueda
  SEARCH: {
    MIN_LENGTH: 2,
    DEBOUNCE_DELAY: 300, // 300ms
    MAX_RESULTS: 10,
  },
};

// Configuración de exportación
export const EXPORT_CONFIG = {
  // Formatos soportados
  FORMATS: {
    EXCEL: 'excel',
    PDF: 'pdf',
    CSV: 'csv',
    JSON: 'json',
  },
  
  // Configuración de archivos
  FILES: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
      'text/csv',
      'application/json',
    ],
  },
};

// Configuración de monitoreo
export const MONITORING_CONFIG = {
  // Métricas de rendimiento
  PERFORMANCE: {
    SLOW_QUERY_THRESHOLD: 1000, // 1 segundo
    ERROR_RATE_THRESHOLD: 0.05, // 5%
  },
  
  // Configuración de logs
  LOGGING: {
    LEVEL: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    ENABLE_CONSOLE: process.env.NODE_ENV !== 'production',
    ENABLE_REMOTE: process.env.NODE_ENV === 'production',
  },
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para validar respuestas de la API
export const validateApiResponse = (response: Response): boolean => {
  return response.ok && response.status >= 200 && response.status < 300;
};

// Función para manejar errores de la API
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Error de respuesta del servidor
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case ERROR_CONFIG.ERROR_CODES.UNAUTHORIZED:
        return ERROR_CONFIG.ERROR_MESSAGES.UNAUTHORIZED;
      case ERROR_CONFIG.ERROR_CODES.FORBIDDEN:
        return ERROR_CONFIG.ERROR_MESSAGES.FORBIDDEN;
      case ERROR_CONFIG.ERROR_CODES.NOT_FOUND:
        return ERROR_CONFIG.ERROR_MESSAGES.NOT_FOUND;
      case ERROR_CONFIG.ERROR_CODES.VALIDATION_ERROR:
        return message || ERROR_CONFIG.ERROR_MESSAGES.VALIDATION_ERROR;
      case ERROR_CONFIG.ERROR_CODES.SERVER_ERROR:
        return ERROR_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
      default:
        return message || ERROR_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
    }
  } else if (error.request) {
    // Error de red
    return ERROR_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    // Error de configuración
    return error.message || ERROR_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
  }
};
