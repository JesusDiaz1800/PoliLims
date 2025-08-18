
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';
import { FilterProvider } from '@/context/filter-context';

const SeguimientoPageContent = dynamic(() => import('@/components/ensayos/seguimiento-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function SeguimientoEnsayosPage() {
    return (
        <FilterProvider>
            <SeguimientoPageContent />
        </FilterProvider>
    )
}
