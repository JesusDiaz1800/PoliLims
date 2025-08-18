
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const WorkflowsPageContent = dynamic(() => import('@/components/workflows/workflows-page-content').then(mod => mod.default), {
  loading: () => <Loading />,
  ssr: false,
});

export default function WorkflowsPage() {
  return <WorkflowsPageContent />;
}
