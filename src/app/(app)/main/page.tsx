
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const MainPageContent = dynamic(() => import('@/components/dashboard/main-page-content'), {
  loading: () => <Loading />,
  ssr: false
});

export default function MainPage() {
  return <MainPageContent />;
}
