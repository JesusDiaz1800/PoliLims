/**
 * Cliente HTTP personalizado para la API Django
 */

import { 
  API_CONFIG, 
  AUTH_CONFIG, 
  ERROR_CONFIG, 
  handleApiError,
  validateApiResponse,
  buildApiUrl,
  type ApiResponse,
  type PaginatedResponse 
} from './api-config';

// Interfaz para las opciones de petición
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

// Interfaz para la configuración del cliente
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
}

// Clase principal del cliente API
export class ApiClient {
  private config: ApiClientConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: config?.baseURL || API_CONFIG.BASE_URL,
      timeout: config?.timeout || API_CONFIG.TIMEOUT,
      retries: config?.retries || API_CONFIG.RETRY_CONFIG.maxRetries,
      enableLogging: config?.enableLogging || process.env.NODE_ENV !== 'production',
    };

    // Cargar tokens del almacenamiento local
    this.loadTokens();
  }

  // Cargar tokens del almacenamiento local
  private loadTokens(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      this.refreshToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    }
  }

  // Guardar tokens en el almacenamiento local
  private saveTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    }
    this.accessToken = accessToken;
    if (refreshToken) {
      this.refreshToken = refreshToken;
    }
  }

  // Limpiar tokens
  public clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER_PROFILE);
    }
    this.accessToken = null;
    this.refreshToken = null;
  }

  // Obtener headers de autenticación
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      ...API_CONFIG.HEADERS,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Crear un controlador de timeout
  private createTimeoutController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  // Manejar renovación de token
  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.access;
        const newRefreshToken = data.refresh;

        this.saveTokens(newAccessToken, newRefreshToken);
        this.refreshSubscribers.forEach(callback => callback(newAccessToken));
        this.refreshSubscribers = [];

        return newAccessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Realizar petición HTTP
  private async makeRequest<T = any>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      signal,
    } = options;

    const url = buildApiUrl(endpoint);
    const requestHeaders = { ...this.getAuthHeaders(), ...headers };
    const timeoutController = this.createTimeoutController(timeout);
    const abortController = new AbortController();

    // Combinar señales de aborto
    if (signal) {
      signal.addEventListener('abort', () => abortController.abort());
    }
    timeoutController.signal.addEventListener('abort', () => abortController.abort());

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const requestBody = body ? JSON.stringify(body) : undefined;

        if (this.config.enableLogging) {
          console.log(`[API] ${method} ${url} (attempt ${attempt + 1}/${retries + 1})`);
        }

        const response = await fetch(url, {
          method,
          headers: requestBody ? { ...requestHeaders, 'Content-Type': 'application/json' } : requestHeaders,
          body: requestBody,
          signal: abortController.signal,
        });

        // Manejar errores de autenticación
        if (response.status === 401 && this.refreshToken && attempt === 0) {
          try {
            await this.handleTokenRefresh();
            // Reintentar la petición con el nuevo token
            continue;
          } catch (refreshError) {
            // Si falla la renovación, redirigir al login
            this.clearTokens();
            window.location.href = '/login';
            throw new Error('Authentication failed');
          }
        }

        const responseData = await response.json().catch(() => null);

        if (validateApiResponse(response)) {
          return {
            data: responseData,
            status: response.status,
          };
        } else {
          throw new Error(responseData?.message || responseData?.error || `HTTP ${response.status}`);
        }
      } catch (error) {
        lastError = error as Error;
        
        if (this.config.enableLogging) {
          console.error(`[API] Error on attempt ${attempt + 1}:`, error);
        }

        // No reintentar en ciertos casos
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        if (attempt === retries) {
          break;
        }

        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_CONFIG.retryDelay * (attempt + 1)));
      }
    }

    throw lastError || new Error('Request failed');
  }

  // Métodos HTTP específicos
  public async get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body: data });
  }

  public async put<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body: data });
  }

  public async patch<T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body: data });
  }

  public async delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Métodos para paginación
  public async getPaginated<T = any>(
    endpoint: string, 
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await this.get<PaginatedResponse<T>>(`${endpoint}${queryParams}`);
    return response.data!;
  }

  // Método para subir archivos
  public async uploadFile<T = any>(
    endpoint: string, 
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    if (!validateApiResponse(response)) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  }

  // Método para descargar archivos
  public async downloadFile(endpoint: string, filename?: string): Promise<void> {
    const response = await fetch(buildApiUrl(endpoint), {
      headers: this.getAuthHeaders(),
    });

    if (!validateApiResponse(response)) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Método para autenticación
  public async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ user: any; access: string; refresh: string }>> {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.data) {
      this.saveTokens(response.data.access, response.data.refresh);
      
      // Guardar perfil de usuario
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  // Método para cerrar sesión
  public async logout(): Promise<void> {
    try {
      await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Ignorar errores en logout
    } finally {
      this.clearTokens();
    }
  }

  // Método para verificar si el usuario está autenticado
  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Método para obtener el perfil del usuario
  public getUserProfile(): any {
    if (typeof window !== 'undefined') {
      const profile = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    }
    return null;
  }

  // Método para actualizar el perfil del usuario
  public updateUserProfile(profile: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();

// Hook personalizado para usar el cliente API
export const useApiClient = () => {
  return apiClient;
};

// Función de utilidad para manejar errores de la API
export const handleApiErrorWithNotification = (error: any): string => {
  const errorMessage = handleApiError(error);
  
  // Aquí podrías integrar con tu sistema de notificaciones
  console.error('[API Error]:', errorMessage);
  
  return errorMessage;
};

// Función de utilidad para validar respuestas
export const validateResponse = <T>(response: ApiResponse<T>): T => {
  if (!response.data) {
    throw new Error('No data received from API');
  }
  return response.data;
};

// Función de utilidad para construir parámetros de consulta
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
};

// Función de utilidad para formatear fechas para la API
export const formatDateForApi = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};

// Función de utilidad para parsear fechas de la API
export const parseDateFromApi = (dateString: string): Date => {
  return new Date(dateString);
};

// Función de utilidad para validar archivos
export const validateFile = (file: File, maxSize?: number, allowedTypes?: string[]): string | null => {
  const maxFileSize = maxSize || 10 * 1024 * 1024; // 10MB por defecto
  const allowedFileTypes = allowedTypes || ['image/*', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

  if (file.size > maxFileSize) {
    return `El archivo es demasiado grande. Tamaño máximo: ${Math.round(maxFileSize / 1024 / 1024)}MB`;
  }

  if (allowedFileTypes.length > 0) {
    const isValidType = allowedFileTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Tipo de archivo no permitido. Tipos permitidos: ${allowedFileTypes.join(', ')}`;
    }
  }

  return null;
};
