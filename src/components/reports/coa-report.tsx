

import * as React from 'react';
import type { Ensayo } from '@/context/data-context';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CoAReportProps {
  data: Ensayo;
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

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between py-1 border-b border-dotted">
        <span className="font-semibold text-muted-foreground">{label}:</span>
        <span className="text-right">{value || '---'}</span>
    </div>
);

const ResultsTable = ({ results }: { results: { parameter: string, value: string, unit: string }[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Parámetro</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
                <TableHead>Unidad</TableHead>
                 <TableHead>Valor Normativo</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {results.filter(r => r.value !== '---').map(res => (
                <TableRow key={res.parameter}>
                    <TableCell className="font-medium">{res.parameter}</TableCell>
                    <TableCell className="text-right font-mono">{res.value}</TableCell>
                    <TableCell>{res.unit}</TableCell>
                    <TableCell>---</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return '---';
    return Number(value).toFixed(decimals);
};


export const CoAReport = ({ data }: CoAReportProps) => {

  const results = [
    { parameter: 'Melt Index (Variación)', value: formatValue(data.meltIndexVariacion, 2), unit: '%' },
    { parameter: 'Densidad', value: formatValue(data.densidadCalculada, 3), unit: 'g/cm³' },
    { parameter: 'Contenido de Fibra de Vidrio (% Total)', value: formatValue(data.fvTotalPorcentaje, 2), unit: '%' },
    { parameter: 'Contenido de Fibra de Vidrio (% Capa Intermedia)', value: formatValue(data.fvIntermediaPorcentaje, 2), unit: '%' },
    { parameter: '% Negro de Humo', value: formatValue(data.negroHumoCalculado, 2), unit: '%' },
    { parameter: 'Dispersión de Negro de Humo', value: data.dispersion_nh || '---', unit: 'Grado' },
    { parameter: 'Resistencia a la Tracción', value: formatValue(data.resistencia_traccion, 2), unit: 'MPa' },
    { parameter: 'Límite de Fluencia', value: formatValue(data.limite_fluencia, 2), unit: 'MPa' },
    { parameter: 'Elongación de Ruptura', value: formatValue(data.elongacion_rotura, 2), unit: '%' },
    { parameter: 'Tiempo de Inducción a la Oxidación (TIO)', value: formatValue(data.tio_tiempo, 2), unit: 'min' },
  ];

  return (
    <div className="bg-card text-card-foreground p-8 rounded-lg border font-body text-sm">
        <style>{`
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                @page {
                    size: A4;
                    margin: 20mm;
                }
            }
        `}</style>
      <ReportHeader />
      <h1 className="text-xl font-bold text-center my-4 font-headline uppercase">Certificado de Análisis - {data.tipo}</h1>

      <div className="grid grid-cols-2 gap-x-12 mt-6 text-sm">
        <div>
            <div className="flex justify-between py-1.5">
                <span className="font-semibold">INSPECTOR:</span>
                <span>{data.inspector || data.analista || '---'}</span>
            </div>
             <div className="flex justify-between py-1.5">
                <span className="font-semibold">FECHA DE INGRESO DE MUESTRA:</span>
                <span>{data.fecha_ingreso || data.fecha || '---'}</span>
            </div>
             <div className="flex justify-between py-1.5">
                <span className="font-semibold">FECHA DE REALIZACIÓN DE ENSAYOS:</span>
                <span>{data.fecha || '---'}</span>
            </div>
            <div className="flex justify-between py-1.5">
                <span className="font-semibold">ÁREA:</span>
                <span>Control de Calidad</span>
            </div>
        </div>
        <div>
             <div className="flex justify-between py-1.5">
                <span className="font-semibold">PRODUCTO:</span>
                <span className="font-mono">{data.producto || '---'}</span>
            </div>
            <div className="flex justify-between py-1.5">
                <span className="font-semibold">LOTE:</span>
                <span className="font-mono">{data.lote || '---'}</span>
            </div>
             <div className="flex justify-between py-1.5">
                <span className="font-semibold">MATERIAL:</span>
                <span>{data.tipo_material || data.tipo.replace('Tubería ', '')}</span>
            </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden mt-6">
        <ResultsTable results={results} />
         <div className="flex justify-between font-bold p-4 bg-muted">
            <span>ESTADO DE APROBACIÓN</span>
            <span className="text-green-600">{data.estado === 'Aprobado' ? 'APROBADO' : '---'}</span>
        </div>
      </div>

       <div className="mt-12 pt-4 text-center">
        <p className="font-semibold">Corroborado por:</p>
        <div className="inline-block mt-12">
            <p className="border-t-2 border-dotted w-full pt-1">Maximiliano Miranda Valdés</p>
        </div>
      </div>
    </div>
  );
};
