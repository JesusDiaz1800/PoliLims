"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

interface FilterContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterType: string;
    setFilterType: (type: string) => void;
    filteredData: any[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const value = useMemo(() => ({
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filteredData: [], // This will be overridden by useFilters hook
    }), [searchTerm, filterType]);
    
    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = <T extends Record<string, any>>(data: T[], searchKeys: (keyof T)[]) => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }

    const { searchTerm, setSearchTerm, filterType, setFilterType } = context;

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchFilterType = filterType === 'all' || item.tipo === filterType;
            const matchSearchTerm = searchKeys.some(key => {
                const value = item[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            });
            return matchFilterType && matchSearchTerm;
        });
    }, [data, searchTerm, filterType, searchKeys]);

    return {
        searchTerm,
        setSearchTerm,
        filterType,
        setFilterType,
        filteredData,
    };
};
