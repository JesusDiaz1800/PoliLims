
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

// Define a more flexible state that can hold multiple filter values
interface FilterState {
    searchTerm: string;
    [key: string]: string; // Allow any other string key for different filters
}

interface FilterContextType {
    filters: FilterState;
    setFilter: (key: string, value: string) => void;
    setSearchTerm: (term: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<FilterState>({ searchTerm: '' });

    const setFilter = useCallback((key: string, value: string) => {
        setFilters(prev => ({...prev, [key]: value}));
    }, []);

    const setSearchTerm = useCallback((term: string) => {
        setFilter('searchTerm', term);
    }, [setFilter]);
    
    const value = useMemo(() => ({
        filters,
        setFilter,
        setSearchTerm
    }), [filters, setFilter, setSearchTerm]);
    
    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

// Update the hook to be more generic
export const useFilters = <T extends Record<string, any>>(data: T[], searchKeys: (keyof T)[]) => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within a FilterProvider');
    }

    const { filters, setFilter, setSearchTerm } = context;
    const { searchTerm, ...otherFilters } = filters;

    const filteredData = useMemo(() => {
        return data.filter(item => {
            // Check custom filters first
            const matchOtherFilters = Object.entries(otherFilters).every(([key, value]) => {
                if (value === 'all' || !value) return true;
                return String(item[key]).toLowerCase() === value.toLowerCase();
            });

            if (!matchOtherFilters) return false;

            // Then check search term
            if (!searchTerm) return true;
            return searchKeys.some(key => {
                const value = item[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, otherFilters, searchKeys]);

    return {
        filters,
        setFilter,
        setSearchTerm,
        searchTerm,
        filteredData,
    };
};
