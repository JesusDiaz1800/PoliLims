

import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { parse, format } from 'date-fns';
import { PenSquare } from 'lucide-react';

interface SummaryReportProps {
  reportData: ReportData;
  title: string;
}

const ReportHeader = () => (
    <div className="flex justify-between items-start pb-4 border-b-2 border-primary">
        <div className="w-24">
             <LogoAlt />
        </div>
        <div className="text-xs text-right">
            <p className="font-bold">Polifusión S.A.</p>
            <p>Lampa, Región Metropolitana</p>
            <p>Cacique Colin 2525</p>
            <p>Fono: (2) 2387 5000 | www.polifusion.cl</p>
        </div>
    </div>
);

const SectionTitle = ({ title, className }: { title: string, className?: string }) => (
    <h2 className={cn("text-lg font-semibold text-primary font-headline border-b border-primary/50 pb-1 my-4", className)}>{title}</h2>
);

const DetailRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div className="flex justify-between py-1 border-b border-dotted detail-row">
        <span className="font-semibold text-muted-foreground">{label}:</span>
        <span className="text-right">{value || '---'}</span>
    </div>
);

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value)) || value === 0) return '---';
    return Number(value).toFixed(decimals);
};

export const SummaryReport = ({ reportData, title }: SummaryReportProps) => {
  const { lotes, material, producto, fechaGeneracion, inspector, corroborador, ensayos, promedios } = reportData;

  const results = [
    { parameter: 'Melt Index', value: formatValue(promedios.meltIndexCalculado, 3), unit: 'g/10min' },
    { parameter: 'Densidad', value: formatValue(promedios.densidadCalculada, 3), unit: 'g/cm³' },
    { parameter: 'DSC', value: formatValue(promedios.dsc_punto_fusion, 2), unit: '°C' },
    { parameter: '% Negro de Humo', value: formatValue(promedios.negroHumoCalculado, 2), unit: '%' },
    { parameter: 'Tiempo de Inducción a la Oxidación (TIO)', value: formatValue(promedios.tio_tiempo, 2), unit: 'min' },
    { parameter: '% de Cenizas', value: formatValue(promedios.cenizasCalculado, 2), unit: '%' },
    { parameter: '% de Fibra de Vidrio (Total)', value: formatValue(promedios.fvTotalPorcentaje, 2), unit: '%' },
  ];

  const getDateRange = () => {
    if (!ensayos || ensayos.length === 0) return '---';
    const dates = ensayos
        .map(e => parse(e.fecha, 'dd-MM-yyyy', new Date()))
        .filter(d => !isNaN(d.getTime()));
    if (dates.length === 0) return '---';
    
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    if (format(minDate, 'dd-MM-yyyy') === format(maxDate, 'dd-MM-yyyy')) {
        return format(minDate, 'dd-MM-yyyy');
    }

    return `${format(minDate, 'dd-MM-yyyy')} al ${format(maxDate, 'dd-MM-yyyy')}`;
  };

  const dateRange = getDateRange();

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
                    font-size: 11pt !important;
                    margin: 8px 0 !important;
                    padding-bottom: 2px !important;
                }
                 .detail-row {
                    padding-top: 2px !important;
                    padding-bottom: 2px !important;
                    font-size: 9pt !important;
                 }
                 .results-grid {
                    gap: 0.5rem !important;
                 }
                .results-card {
                    padding: 0.5rem !important;
                }
                .results-card h3 {
                    font-size: 8pt !important;
                }
                .results-card p {
                    font-size: 14pt !important;
                }
                .results-table {
                     margin-top: 0.5rem !important;
                     page-break-inside: avoid;
                }
                .signature-section {
                    margin-top: 1rem !important;
                    padding-top: 0.5rem !important;
                    page-break-before: auto;
                    page-break-inside: avoid;
                }
                 h1 {
                    font-size: 14pt !important;
                    margin: 1rem 0 !important;
                }
                 td, th {
                    padding: 2px 4px !important;
                    font-size: 9pt !important;
                }
            }
        `}</style>
        <div className="report-container">
            <ReportHeader />
            <h1 className="text-2xl font-bold text-center my-6 font-headline uppercase">{title}</h1>

            <div className="grid grid-cols-2 gap-x-12 mt-4 text-sm">
                 <div>
                    <SectionTitle title="Datos del Informe" className="report-section-title"/>
                    <DetailRow label="Fecha de Emisión" value={fechaGeneracion} />
                    <DetailRow label="Material" value={material} />
                    <DetailRow label="Lotes Incluidos" value={lotes.join(', ')} />
                </div>
                <div>
                    <SectionTitle title="Trazabilidad" className="report-section-title"/>
                    <DetailRow label="Rango de Fechas de Ensayo" value={dateRange} />
                    <DetailRow label="Generado por" value={inspector} />
                    <DetailRow label="Corroborado por" value={corroborador} />
                </div>
            </div>

            <SectionTitle title="Resultados Promedio de Laboratorio" className="report-section-title"/>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 results-grid">
                {results.filter(r => r.value !== '---').map(res => (
                    <div key={res.parameter} className="p-3 rounded-lg border bg-muted/30 results-card">
                        <h3 className="text-xs text-muted-foreground">{res.parameter}</h3>
                        <p className="text-xl font-bold font-headline">{res.value} <span className="text-sm font-normal text-muted-foreground">{res.unit}</span></p>
                    </div>
                ))}
            </div>
        
            <SectionTitle title="Detalle por Lote" className="report-section-title"/>
            <div className="border rounded-lg overflow-hidden results-table">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Producto</TableHead>
                            <TableHead>Lote</TableHead>
                            <TableHead className="text-right">M.I.</TableHead>
                            <TableHead className="text-right">Densidad</TableHead>
                            <TableHead className="text-right">DSC</TableHead>
                            <TableHead className="text-right">% NH</TableHead>
                            <TableHead className="text-right">TIO</TableHead>
                            <TableHead className="text-right">% Cenizas</TableHead>
                            <TableHead className="text-right">% FV</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {ensayos.map(e => (
                        <TableRow key={e.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{e.producto}</TableCell>
                            <TableCell className="font-mono">{e.lote}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.meltIndexCalculado, 3)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.densidadCalculada, 3)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.dsc_punto_fusion)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.negroHumoCalculado)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.tio_tiempo)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.cenizasCalculado)}</TableCell>
                            <TableCell className="text-right font-mono">{formatValue(e.fvTotalPorcentaje)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-16 pt-4 border-t text-center signature-section">
                <div className="inline-block">
                    {/* Nota de implementación: En producción, aquí se insertaría la imagen de la firma digital (SVG/PNG)
                    obtenida de un servicio de firma (ej. DocuSign) o generada a partir de un certificado. */}
                    <div className="w-64 h-20 flex flex-col items-center justify-center border-2 border-dashed rounded-md">
                        <PenSquare className="h-8 w-8 text-muted-foreground/50"/>
                        <span className="text-xs text-muted-foreground mt-1">Firma Digital Válida</span>
                    </div>
                    <div className="border-t-2 border-primary w-full pt-1 mt-2 text-center">
                        <p className="font-semibold">Maximiliano Miranda Valdés</p>
                        <p className="text-xs text-muted-foreground">Ing. Analista de Control de Calidad</p>
                        <p className="text-xs text-muted-foreground">Polifusión S.A.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
