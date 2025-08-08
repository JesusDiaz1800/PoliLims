

import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { SummaryReport } from './SummaryReport';
import { CoAReport } from './coa-report';

interface ReportContainerProps {
  reportData: ReportData;
}

export const ReportContainer = ({ reportData }: ReportContainerProps) => {
  const { filterType } = reportData;

  // Decide which report component to render based on the filterType
  if (filterType === 'Tubería HDPE' || filterType === 'Tubería PP') {
    // For single product reports, we expect only one ensayo
    if (reportData.ensayos.length === 1) {
      return <CoAReport data={reportData.ensayos[0]} />;
    }
  }
  
  // Default to summary report for multi-selection or other types
  const reportTitle = `Informe de Resultados - ${filterType}`;
  return (
    <SummaryReport
      reportData={reportData}
      title={reportTitle}
    />
  );
};
