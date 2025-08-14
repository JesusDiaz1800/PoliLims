
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const ControlRutinarioPageClient = dynamic(
  () => import('@/components/ensayos/control-rutinario-page'),
  { 
    loading: () => <Loading />,
    ssr: false 
  }
);

export default function ControlRutinarioPage() {
  return <ControlRutinarioPageClient />;
}
