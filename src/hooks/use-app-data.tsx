"use client";

import { useAuth } from '@/context/auth-context';
import { useDynamicData } from '@/context/data-context-optimized';

export function useAppData() {
  const { user: authUser, isAuthenticated } = useAuth();
  const dataContext = useDynamicData();

  // Combinar el usuario autenticado con los datos del contexto
  const combinedData = {
    ...dataContext,
    user: authUser || dataContext.user,
    isAuthenticated
  };

  return combinedData;
}
