
"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface FilterContextType {
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  filteredData: any[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const filteredData: any[] = [];

  return (
    <FilterContext.Provider value={{
      filters,
      setFilter,
      clearFilters,
      filteredData
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters(data: any[], searchFields: string[]) {
  const context = useContext(FilterContext);
  
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  
  const { filters, setFilter, clearFilters } = context;
  
  // Cache por firma de filtros + longitud de datos para evitar recomputar
  const filteredData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Si no hay filtros activos devolvemos el array original (evita copiar)
    if (!filters || Object.keys(filters).length === 0) {
      return data;
    }

    const normalizedFilters = Object.entries(filters).filter(([_, v]) => v != null && v !== '' && v !== 'all');
    if (normalizedFilters.length === 0) return data;

    return data.filter(item => {
      for (const [key, value] of normalizedFilters) {
        const itemValue = (item?.[key] ?? '').toString().toLowerCase();
        const filterValue = value.toString().toLowerCase();
        if (!itemValue.includes(filterValue)) return false;
      }
      return true;
    });
  }, [data, filters]);

  return { 
    filteredData, 
    setFilter, 
    clearFilters,
    filters,
    searchTerm: '',
    setSearchTerm: () => {} // Placeholder para compatibilidad
  };
}
