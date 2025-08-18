"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import { FilterProvider } from '@/context/filter-context';

const AuditoriasPageContent = dynamic(() => import('@/components/auditorias/auditorias-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false,
});

export default function AuditoriasPage() {
    return (
        <FilterProvider>
            <AuditoriasPageContent />
        </FilterProvider>
    )
}
