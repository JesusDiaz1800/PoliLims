
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const RealizarEvaluacionPageContent = dynamic(() => import('@/components/mis-evaluaciones/realizar-evaluacion-page-content').then(mod => mod.default), {
    loading: () => <Loading />,
    ssr: false
});

export default function RealizarEvaluacionPage() {
    return <RealizarEvaluacionPageContent />;
}
