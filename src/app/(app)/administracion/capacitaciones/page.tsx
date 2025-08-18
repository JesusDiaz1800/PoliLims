"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const CapacitacionesPageContent = dynamic(() => import('@/components/capacitaciones/capacitaciones-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function CapacitacionesPage() {
    return <CapacitacionesPageContent />;
}
