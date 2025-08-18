
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const DynamicControlRutinario = dynamic(() => import('@/components/ensayos/control-rutinario-page').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function ControlRutinarioPage() {
  return <DynamicControlRutinario />;
}
