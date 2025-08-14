
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import { useDynamicData } from '@/context/data-context';
import type { GeneratedReport } from '@/context/data-context';

/**
 * @component BibliotecaInformesPage
 * @description This page component displays a library of generated reports.
 * It fetches the report data on the client side and handles the loading state.
 */
export default function BibliotecaInformesPage() {
  const { generatedReports, isLoaded, deleteGeneratedReport } = useDynamicData();
  
  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} onDelete={deleteGeneratedReport} />
    </div>
  );
}
