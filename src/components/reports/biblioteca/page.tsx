
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import * as dataService from '@/services/data-service';
import type { GeneratedReport } from '@/context/data-context';

export default function BibliotecaInformesPage() {
  const [generatedReports, setGeneratedReports] = React.useState<GeneratedReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getInitialData();
      setGeneratedReports(data.generatedReports);
    } catch (error) {
      console.error("Failed to load generated reports", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  React.useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <BibliotecaInformesTable informes={generatedReports} />
    </div>
  );
}

