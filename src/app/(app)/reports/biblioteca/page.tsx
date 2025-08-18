
"use client";

import * as React from 'react';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import { useDynamicData } from '@/context/data-context';

export default function BibliotecaInformesPage() {
  const { generatedReports, deleteGeneratedReport } = useDynamicData();

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} onDelete={deleteGeneratedReport} />
    </div>
  );
}
