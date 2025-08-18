
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import { FilterProvider } from '@/context/filter-context';

const NoConformidadesPageContent = dynamic(() => import('@/components/no-conformidades/page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false,
});


export default function NoConformidadesPage() {
    return (
        <FilterProvider>
            <NoConformidadesPageContent />
        </FilterProvider>
    )
}
