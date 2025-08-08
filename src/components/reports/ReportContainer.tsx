
import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { SummaryReport } from './SummaryReport';
import { CoAReport } from './coa-report';

interface ReportContainerProps {
  reportData: ReportData;
}

export const ReportContainer = ({ reportData }: ReportContainerProps) => {
  const { filterType } = reportData;

  const isSingleProductReport = (filterType === 'Tubería HDPE' || filterType === 'Tubería PP') && reportData.ensayos.length === 1;

  if (isSingleProductReport) {
    return <CoAReport data={reportData.ensayos[0]} />;
  }
  
  const reportTitle = `Informe de Resumen - ${filterType}`;
  return (
    <SummaryReport
      reportData={reportData}
      title={reportTitle}
    />
  );
};
