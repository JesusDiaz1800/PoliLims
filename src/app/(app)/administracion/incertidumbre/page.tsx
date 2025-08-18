
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const IncertidumbrePageContent = dynamic(() => import('@/components/incertidumbre/incertidumbre-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false,
});

export default function IncertidumbrePage() {
  return <IncertidumbrePageContent />;
}
