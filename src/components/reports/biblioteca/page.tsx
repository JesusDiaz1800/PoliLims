
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { BibliotecaInformesTable } from '@/components/reports/biblioteca-informes-table';
import * as dataService from '@/services/data-service';
import type { GeneratedReport } from '@/context/data-context';

/**
 * @component BibliotecaInformesPage
 * @description This page component displays a library of generated reports.
 * It fetches the report data on the client side and handles the loading state.
 */
export default function BibliotecaInformesPage() {
  const [generatedReports, setGeneratedReports] = React.useState<GeneratedReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  /**
   * @callback loadData
   * @description Asynchronously loads the generated reports data from the data service
   * and updates the component's state. It is wrapped in `useCallback` for optimization.
   */
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getInitialData();
      setGeneratedReports(data.generatedReports);
    } catch (error) {
      console.error("Failed to load generated reports", error);
      // Here you could set an error state to show a message to the user
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
