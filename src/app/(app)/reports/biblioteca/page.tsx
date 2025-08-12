
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import { useDynamicData } from '@/context/data-context';

export default function BibliotecaInformesPage() {
  const { generatedReports, isLoaded } = useDynamicData();

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} />
    </div>
  );
}
