
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import { FilterProvider } from '@/context/filter-context';

const EquiposPageContent = dynamic(() => import('@/components/equipos/equipos-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function EquiposPage() {
    return (
        <FilterProvider>
            <EquiposPageContent />
        </FilterProvider>
    )
}
