
import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { SummaryReport } from './SummaryReport';
import { CoAReport } from './coa-report';

interface ReportContainerProps {
  reportData: ReportData;
}

export const ReportContainer = ({ reportData }: ReportContainerProps) => {
  const { filterType, ensayos, fechaGeneracion } = reportData;

  const isSingleProductReport = (filterType === 'Tubería HDPE' || filterType === 'Tubería PP') && ensayos.length === 1;

  if (isSingleProductReport) {
    return <CoAReport data={ensayos[0]} fechaEmision={fechaGeneracion} />;
  }
  
  const reportTitle = `Informe de Resultados - ${filterType}`;
  return (
    <SummaryReport
      reportData={reportData}
      title={reportTitle}
    />
  );
};
