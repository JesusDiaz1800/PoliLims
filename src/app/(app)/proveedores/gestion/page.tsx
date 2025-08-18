
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';
import { FilterProvider } from '@/context/filter-context';

const GestionProveedoresPageContent = dynamic(() => import('@/components/proveedores/gestion-proveedores-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function GestionProveedoresPage() {
  return (
    <FilterProvider>
      <GestionProveedoresPageContent />
    </FilterProvider>
  );
}
