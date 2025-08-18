"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const MisEvaluacionesPageContent = dynamic(() => import('@/components/mis-evaluaciones/mis-evaluaciones-page-content').then(mod => mod.default), {
    loading: () => <Loading />,
    ssr: false
});

export default function MisEvaluacionesPage() {
    return <MisEvaluacionesPageContent />;
}
