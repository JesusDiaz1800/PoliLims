
import * as React from 'react';
import type { Ensayo } from '@/context/data-context';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoAReportProps {
  data: Ensayo & { productoInfo?: any };
  fechaEmision: string;
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
    <div className="flex justify-between py-1 border-b border-dotted detail-row">
        <span className="font-semibold text-muted-foreground">{label}:</span>
        <span className="text-right">{value || '---'}</span>
    </div>
);

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value))) return '---';
    return Number(value).toFixed(decimals);
};

interface ResultRow {
  parameter: string;
  value: string;
  unit: string;
  normative: string;
  verdict: boolean | null;
}

const ResultsTable = ({ results }: { results: ResultRow[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Parámetro</TableHead>
                <TableHead className="text-right">Resultado</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Valor Normativo</TableHead>
                <TableHead className="text-center">Veredicto</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {results.filter(r => r.value !== '---').map(res => (
                <TableRow key={res.parameter}>
                    <TableCell className="font-medium">{res.parameter}</TableCell>
                    <TableCell className="text-right font-mono">{res.value}</TableCell>
                    <TableCell>{res.unit}</TableCell>
                    <TableCell>{res.normative}</TableCell>
                    <TableCell className="text-center">
                        {res.verdict !== null && (
                            <div className={cn("inline-flex items-center justify-center w-5 h-5 rounded-full", res.verdict ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                                {res.verdict ? <Check size={14} /> : <X size={14} />}
                            </div>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);


export const CoAReport = ({ data, fechaEmision }: CoAReportProps) => {

  const results: ResultRow[] = [];

  if (data.tipo === 'Tubería HDPE') {
      results.push(
        { parameter: 'Melt Index (Variación)', value: formatValue(data.meltIndexVariacion, 2), unit: '%', normative: '< 30%', verdict: data.meltIndexVariacion < 30 },
        { parameter: 'Densidad', value: formatValue(data.densidadCalculada, 3), unit: 'g/cm³', normative: '> 0.955', verdict: data.densidadCalculada > 0.955 },
        { parameter: '% Negro de Humo', value: formatValue(data.negroHumoCalculado, 2), unit: '%', normative: '2.0 - 3.0', verdict: data.negroHumoCalculado >= 2.0 && data.negroHumoCalculado <= 3.0 },
        { parameter: 'Dispersión de Negro de Humo', value: data.dispersion_nh || '---', unit: 'Grado', normative: '< 3', verdict: data.dispersion_nh ? (parseInt(data.dispersion_nh.replace('Grado ', '').charAt(1)) < 3) : null },
        { parameter: 'Resistencia a la Tracción', value: formatValue(data.resistencia_traccion, 2), unit: 'MPa', normative: '> 22', verdict: data.resistencia_traccion > 22 },
        { parameter: 'Elongación de Ruptura', value: formatValue(data.elongacion_rotura, 2), unit: '%', normative: '> 500', verdict: data.elongacion_rotura > 500 },
        { parameter: 'Tiempo de Inducción a la Oxidación (TIO)', value: formatValue(data.tio_tiempo, 2), unit: 'min', normative: '> 20', verdict: data.tio_tiempo > 20 }
      );
  } else if (data.tipo === 'Tubería PP') {
      results.push(
          { parameter: 'Melt Index (Variación)', value: formatValue(data.meltIndexVariacion, 2), unit: '%', normative: '< 30%', verdict: data.meltIndexVariacion < 30 },
          { parameter: 'Densidad', value: formatValue(data.densidadCalculada, 3), unit: 'g/cm³', normative: '---', verdict: null },
          { parameter: 'Contenido de Fibra de Vidrio (% Total)', value: formatValue(data.fvTotalPorcentaje, 2), unit: '%', normative: '> 5%', verdict: data.fvTotalPorcentaje > 5 },
          { parameter: 'Contenido de Fibra de Vidrio (% Capa Intermedia)', value: formatValue(data.fvIntermediaPorcentaje, 2), unit: '%', normative: '> 15%', verdict: data.fvIntermediaPorcentaje > 15 },
      );
  }

  return (
    <div className="bg-card text-card-foreground p-8 rounded-lg border font-body text-sm max-w-4xl mx-auto">
        <style>{`
           @media print {
                body, html {
                    margin: 0 !important;
                    padding: 0 !important;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .report-container {
                    width: 100% !important;
                    border: none !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    page-break-inside: avoid;
                }
                 .report-section-title {
                    margin-top: 0.5rem !important;
                    margin-bottom: 0.25rem !important;
                    padding-bottom: 0.1rem !important;
                }
                .results-table {
                    margin-top: 0.5rem !important;
                    page-break-inside: avoid;
                }
                .final-verdict {
                    padding: 0.25rem !important;
                }
                 .signature-section {
                    margin-top: 1rem !important;
                    padding-top: 0.5rem !important;
                    page-break-before: auto;
                    page-break-inside: avoid;
                }
                 h1 {
                    margin-top: 0.5rem !important;
                    margin-bottom: 0.5rem !important;
                }
                 td, th {
                    padding: 1px 4px !important;
                }
                .detail-row {
                    padding-top: 1px !important;
                    padding-bottom: 1px !important;
                }
            }
        `}</style>
      <div className="report-container">
        <ReportHeader />
        <h1 className="text-2xl font-bold text-center my-4 font-headline uppercase">Certificado de Análisis - {data.tipo}</h1>

        <div className="grid grid-cols-2 gap-x-12 mt-4 text-sm">
            <div>
                <SectionTitle title="Trazabilidad del Producto" className="report-section-title"/>
                <DetailRow label="PRODUCTO" value={<span className="font-bold">{data.producto || '---'}</span>} />
                <DetailRow label="LOTE" value={<span className="font-mono font-bold">{data.lote || '---'}</span>} />
                <DetailRow label="ID Ensayo" value={<span className="font-mono">{data.id}</span>} />
                <DetailRow label="ID Muestra" value={<span className="font-mono">{data.id_muestra || '---'}</span>} />
            </div>
            <div>
                <SectionTitle title="Información del Ensayo" className="report-section-title"/>
                <DetailRow label="Fecha de Emisión" value={fechaEmision} />
                <DetailRow label="Fecha de Muestra" value={data.fecha_ingreso || '---'} />
                <DetailRow label="Fecha de Análisis" value={data.fecha || '---'} />
                <DetailRow label="Inspector de Línea" value={data.inspector || '---'} />
                <DetailRow label="Analista de Laboratorio" value={data.analista || '---'} />
            </div>
        </div>
        
        <SectionTitle title="Resultados de Ensayos" className="report-section-title"/>
        <div className="border rounded-lg overflow-hidden results-table">
            <ResultsTable results={results} />
            <div className={cn("flex justify-between font-bold text-lg p-4 bg-muted final-verdict", data.estado === 'Aprobado' ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30")}>
                <span>VEREDICTO FINAL</span>
                <span className={cn(data.estado === 'Aprobado' ? "text-green-600 dark:text-green-300" : "text-red-600 dark:text-red-400")}>
                    {data.estado ? data.estado.toUpperCase() : 'PENDIENTE'}
                </span>
            </div>
        </div>

        <div className="mt-8 pt-4 text-center signature-section">
            <p className="font-semibold">Corroborado por:</p>
            <div className="inline-block mt-8">
                <p className="border-t-2 border-dotted w-full pt-1">Maximiliano Miranda Valdés</p>
            </div>
        </div>
      </div>
    </div>
  );
};
