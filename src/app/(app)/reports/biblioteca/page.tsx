
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import * as dataService from '@/services/data-service';
import type { GeneratedReport } from '@/context/data-context';

export default function BibliotecaInformesPage() {
  const [generatedReports, setGeneratedReports] = React.useState<GeneratedReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const data = await dataService.getInitialData();
        setGeneratedReports(data.generatedReports);
        setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} />
    </div>
  );
}
