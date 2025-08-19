"use client";

import * as React from 'react';
import MainPageContent from '@/components/dashboard/main-page-content';
import { FilterProvider } from '@/context/filter-context';

export default function DashboardPage() {
  // El contenido del dashboard ahora se renderiza en su propia ruta, 
  // asegurando que siempre esté dentro del AppShell y el layout principal.
  return (
    <FilterProvider>
        <MainPageContent />
    </FilterProvider>
  );
}
