
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const DynamicControlAgua = dynamic(() => import('@/components/ensayos/control-agua-page'), {
    loading: () => <Loading />,
    ssr: false
});


export default function ControlAguaPage() {
    return <DynamicControlAgua />;
}
