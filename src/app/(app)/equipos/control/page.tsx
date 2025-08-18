
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';
import { FilterProvider } from '@/context/filter-context';

const ControlEquiposPageContent = dynamic(() => import('@/components/equipos/control-equipos-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});


export default function ControlEquiposPage() {
    return (
        <FilterProvider>
            <ControlEquiposPageContent />
        </FilterProvider>
    )
}
