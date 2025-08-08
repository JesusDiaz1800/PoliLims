
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';

export default function BibliotecaInformesPage() {
  const { generatedReports, isLoading } = useDynamicData();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} />
    </div>
  );
}
