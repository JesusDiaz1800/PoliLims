
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const DynamicControlAccesorios = dynamic(() => import('@/components/ensayos/control-accesorios-page'), {
  loading: () => <Loading />,
  ssr: false
});

export default function ControlAccesoriosPage() {
    return <DynamicControlAccesorios />;
}
