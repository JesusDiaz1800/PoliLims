
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/(app)/loading';

const ResistenciaPresionHidrostaticaPageContent = dynamic(
  () => import('@/components/ensayos/phi/resistencia-presion-hidrostatica-content'),
  { loading: () => <Loading />, ssr: false }
);

export default function ResistenciaPresionHidrostaticaPage() {
    return <ResistenciaPresionHidrostaticaPageContent />;
}
