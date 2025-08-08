

import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { SummaryReport } from './SummaryReport';

interface ReportContainerProps {
  reportData: ReportData;
}

export const ReportContainer = ({ reportData }: ReportContainerProps) => {
  const { filterType } = reportData;

  const reportTitle = `Informe de Resultados - ${filterType}`;

  return (
    <SummaryReport
      reportData={reportData}
      title={reportTitle}
    />
  );
};
