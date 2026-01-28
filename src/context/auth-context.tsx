"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Usuario } from './data-context-optimized';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuario mock para jdiaz
const jdiazUser: Usuario = {
  id: '1',
  username: 'jdiaz',
  email: 'jdiaz@polifusion.cl',
  rol: 'Ing. Analista de Calidad',
  nombre: 'Jesus',
  apellido: 'Diaz',
  fullName: 'Jesus Diaz',
  role: 'Ing. Analista de Calidad',
  departamento: 'Laboratorio',
  activo: true,
  ultimoAcceso: '23-07-2025 10:30',
  permisos: ['read', 'write', 'admin']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('poliLims_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('poliLims_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar credenciales (solo jdiaz por ahora)
    if (username === 'jdiaz' && password === 'jdiaz2025') {
      setUser(jdiazUser);
      localStorage.setItem('poliLims_user', JSON.stringify(jdiazUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('poliLims_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
