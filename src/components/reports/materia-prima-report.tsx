

import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MateriaPrimaSummaryReportProps {
  reportData: ReportData;
}

const ReportHeader = () => (
    <div className="flex justify-between items-start pb-4 border-b-2 border-primary">
        <div className="text-xs">
            <p className="font-bold">Polifusión S.A.</p>
            <p>Lampa, Región Metropolitana</p>
            <p>Cacique Colin 2525</p>
            <p>(2) 2387 5000</p>
        </div>
        <div className="w-32">
            <LogoAlt />
        </div>
    </div>
);

const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="text-lg font-semibold text-primary font-headline border-b border-primary/50 pb-1 my-4">{title}</h2>
);

const DetailRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="flex justify-between py-1.5 px-2 rounded-md transition-colors hover:bg-muted/50">
        <span className="font-semibold text-muted-foreground">{label}:</span>
        <span className="text-right font-medium">{value || '---'}</span>
    </div>
);

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return '---';
    return Number(value).toFixed(decimals);
};

export const MateriaPrimaSummaryReport = ({ reportData }: MateriaPrimaSummaryReportProps) => {
  const { lotes, material, producto, fechaGeneracion, inspector, corroborador, ensayos, promedios } = reportData;

  const results = [
    { parameter: 'Melt Index', value: formatValue(promedios.meltIndex, 3), unit: 'g/10min' },
    { parameter: 'Densidad', value: formatValue(promedios.densidad, 3), unit: 'g/cm³' },
    { parameter: 'DSC', value: formatValue(promedios.dsc, 2), unit: '°C' },
    { parameter: '% Negro de Humo', value: formatValue(promedios.negroHumo, 2), unit: '%' },
    { parameter: 'Tiempo de Inducción a la Oxidación (TIO)', value: formatValue(promedios.tio, 2), unit: 'min' },
    { parameter: '% de Cenizas', value: formatValue(promedios.cenizas, 2), unit: '%' },
  ];

  return (
    <div className="bg-card text-card-foreground p-8 rounded-lg border font-body text-sm max-w-4xl mx-auto">
        <style>{`
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: A4; margin: 20mm; }
            }
        `}</style>
        <ReportHeader />
        <h1 className="text-xl font-bold text-center my-4 font-headline uppercase">Informe de Resultados - Materia Prima</h1>

        <div className="grid grid-cols-2 gap-x-12 mt-6">
            <div>
              <SectionTitle title="Datos Generales del Informe" />
              <DetailRow label="Material" value={material} />
              <DetailRow label="Producto" value={producto} />
              <DetailRow label="Lotes Incluidos" value={lotes.join(', ')} />
            </div>
            <div>
              <SectionTitle title="Información de Trazabilidad" />
              <DetailRow label="Fecha de Emisión" value={fechaGeneracion} />
              <DetailRow label="Generado por" value={inspector} />
              <DetailRow label="Corroborado por" value={corroborador} />
            </div>
        </div>

        <SectionTitle title="Resultados Promedio de Laboratorio" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {results.filter(r => r.value !== '---').map(res => (
                 <div key={res.parameter} className="p-3 rounded-lg border bg-muted/30">
                    <h3 className="text-xs text-muted-foreground">{res.parameter}</h3>
                    <p className="text-xl font-bold font-headline">{res.value} <span className="text-sm font-normal text-muted-foreground">{res.unit}</span></p>
                </div>
            ))}
        </div>
      
        <SectionTitle title="Detalle por Lote" />
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Lote</TableHead>
                        <TableHead className="text-right">Melt Index</TableHead>
                        <TableHead className="text-right">Densidad</TableHead>
                        <TableHead className="text-right">DSC</TableHead>
                        <TableHead className="text-right">% NH</TableHead>
                        <TableHead className="text-right">TIO</TableHead>
                        <TableHead className="text-right">% Cenizas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {ensayos.map(e => (
                       <TableRow key={e.id}>
                           <TableCell className="font-mono font-medium">{e.lote}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.meltIndexCalculado, 3)}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.densidadCalculada, 3)}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.dsc_punto_fusion, 2)}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.negroHumoCalculado, 2)}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.tio_tiempo, 2)}</TableCell>
                           <TableCell className="text-right font-mono">{formatValue(e.cenizasCalculado, 2)}</TableCell>
                       </TableRow>
                   ))}
                </TableBody>
            </Table>
        </div>

       <div className="mt-16 pt-4 border-t text-center">
        <div className="inline-block">
            <div className="w-64 h-16"></div>
            <p className="text-sm border-t-2 border-dotted w-full pt-1 mt-1">Firma y Timbre Calidad</p>
        </div>
      </div>
    </div>
  );
};
