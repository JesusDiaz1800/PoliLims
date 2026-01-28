/**
 * Hook personalizado para manejar la autenticación con el backend Django
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { AUTH_CONFIG } from '@/lib/api-config';

// Interfaces para la autenticación
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  employee_id?: string;
  department?: string;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Hook de autenticación
export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verificar si el usuario está autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Verificar si hay tokens almacenados
        const accessToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!accessToken || !refreshToken) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Verificar si el token es válido
        const userProfile = apiClient.getUserProfile();
        if (userProfile) {
          setAuthState({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Intentar renovar el token
          try {
            await apiClient.handleTokenRefresh();
            const refreshedProfile = apiClient.getUserProfile();
            if (refreshedProfile) {
              setAuthState({
                user: refreshedProfile,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error('No se pudo obtener el perfil del usuario');
            }
          } catch (refreshError) {
            // Si falla la renovación, limpiar tokens
            apiClient.clearTokens();
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Error al verificar la autenticación',
        });
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiClient.login(credentials);
      
      if (response.data) {
        const user = response.data.user;
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        // Redirigir al dashboard
        router.push('/main');
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Error al iniciar sesión',
      }));
    }
  }, [router]);

  // Función de logout
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await apiClient.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      // Redirigir al login
      router.push('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así, limpiar el estado local
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    }
  }, [router]);

  // Función para refrescar datos del usuario
  const refreshUser = useCallback(async () => {
    try {
      if (!authState.isAuthenticated) return;
      
      // Aquí podrías hacer una llamada a la API para obtener datos actualizados del usuario
      const userProfile = apiClient.getUserProfile();
      if (userProfile) {
        setAuthState(prev => ({
          ...prev,
          user: userProfile,
        }));
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    }
  }, [authState.isAuthenticated]);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshUser,
    clearError,
  };
}

// Hook para proteger rutas
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Hook para verificar permisos
export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    
    // Aquí puedes implementar tu lógica de permisos
    // Por ejemplo, basado en el rol del usuario
    const rolePermissions: Record<string, string[]> = {
      'Administrador': ['all'],
      'Supervisor': ['read', 'write', 'approve'],
      'Analista': ['read', 'write'],
      'Inspector de Calidad': ['read', 'write', 'approve', 'reject'],
      'Técnico': ['read', 'write'],
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  }, [user]);

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('Administrador');
  }, [hasRole]);

  const isSupervisor = useCallback(() => {
    return hasRole('Supervisor') || hasRole('Administrador');
  }, [hasRole]);

  const isAnalyst = useCallback(() => {
    return hasRole('Analista') || hasRole('Supervisor') || hasRole('Administrador');
  }, [hasRole]);

  const isInspector = useCallback(() => {
    return hasRole('Inspector de Calidad') || hasRole('Supervisor') || hasRole('Administrador');
  }, [hasRole]);

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isSupervisor,
    isAnalyst,
    isInspector,
    user,
  };
}

// Hook para manejar tokens
export function useTokenManager() {
  const getAccessToken = useCallback(() => {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }, []);

  const getRefreshToken = useCallback(() => {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER_PROFILE);
  }, []);

  const isTokenExpired = useCallback((token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expirationTime;
    } catch (error) {
      return true; // Si no se puede decodificar, considerar como expirado
    }
  }, []);

  const getTokenExpirationTime = useCallback((token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }, []);

  return {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    isTokenExpired,
    getTokenExpirationTime,
  };
}

// Hook para manejar sesiones
export function useSessionManager() {
  const { user, isAuthenticated } = useAuth();
  const { clearTokens } = useTokenManager();

  const startSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('session_start', Date.now().toString());
      sessionStorage.setItem('user_id', user?.id?.toString() || '');
    }
  }, [user]);

  const endSession = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
      clearTokens();
    }
  }, [clearTokens]);

  const getSessionDuration = useCallback(() => {
    if (typeof window !== 'undefined') {
      const startTime = sessionStorage.getItem('session_start');
      if (startTime) {
        return Date.now() - parseInt(startTime);
      }
    }
    return 0;
  }, []);

  const isSessionValid = useCallback(() => {
    if (typeof window !== 'undefined') {
      const sessionStart = sessionStorage.getItem('session_start');
      const userId = sessionStorage.getItem('user_id');
      
      if (!sessionStart || !userId) return false;
      
      const sessionDuration = Date.now() - parseInt(sessionStart);
      const maxSessionDuration = 8 * 60 * 60 * 1000; // 8 horas
      
      return sessionDuration < maxSessionDuration && userId === user?.id?.toString();
    }
    return false;
  }, [user]);

  return {
    startSession,
    endSession,
    getSessionDuration,
    isSessionValid,
  };
}
