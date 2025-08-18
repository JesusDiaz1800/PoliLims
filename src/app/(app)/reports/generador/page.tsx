
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const GeneradorInformesPageContent = dynamic(() => import('@/components/reports/generador-informes-page').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function GeneradorInformesPage() {
    return <GeneradorInformesPageContent />;
}
