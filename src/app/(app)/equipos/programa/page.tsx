
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const ProgramaPageContent = dynamic(() => import('@/components/equipos/programa-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});


export default function ProgramaPage() {
    return <ProgramaPageContent />;
}
