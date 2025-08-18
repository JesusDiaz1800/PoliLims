
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const ControlAmbientalPageContent = dynamic(() => import('@/components/ambiental/control-ambiental-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function ControlAmbientalPage() {
    return <ControlAmbientalPageContent />;
}
