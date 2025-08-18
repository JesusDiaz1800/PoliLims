"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../../loading';

const FormacionPageContent = dynamic(() => import('@/components/formacion/formacion-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false
});

export default function RegistrosFormacionPage() {
  return <FormacionPageContent />;
}
