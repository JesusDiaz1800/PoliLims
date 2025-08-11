
import * as React from 'react';
import type { ReportData } from '@/app/(app)/reports/generador/actions';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, ArrowDownWideNarrow, ArrowUpWideNarrow, Sigma, PenSquare } from 'lucide-react';

const ReportHeader = ({ title, producto, fecha }: { title: string, producto: string, fecha: string }) => (
    <div className="flex justify-between items-start pb-4 border-b-2 border-primary">
        <div className="w-24">
             <LogoAlt />
        </div>
        <div className="text-center">
            <h1 className="text-2xl font-bold font-headline uppercase">{title}</h1>
            <p className="text-lg font-semibold">{producto}</p>
        </div>
        <div className="text-xs text-right">
            <p className="font-bold">Polifusión S.A.</p>
            <p>Lampa, Región Metropolitana</p>
            <p>Fecha de Emisión: {fecha}</p>
        </div>
    </div>
);

const SectionTitle = ({ title, className }: { title: string, className?: string }) => (
    <h2 className={cn("text-lg font-semibold text-primary font-headline border-b border-primary/50 pb-1 my-4", className)}>{title}</h2>
);

const StatCard = ({ title, value, unit, icon, className }: { title: string; value: string; unit: string; icon: React.ReactNode; className?: string }) => (
    <div className={cn("p-3 rounded-lg border bg-muted/30", className)}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {icon}
            <span>{title}</span>
        </div>
        <p className="text-xl font-bold font-headline">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
    </div>
);

const formatValue = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(Number(value)) || (typeof value === 'number' && value === 0 && decimals > 0)) return '---';
    return Number(value).toFixed(decimals);
};

export const ProductHistoryReport = ({ reportData }: { reportData: ReportData }) => {
    const { producto, fechaGeneracion, ensayos, estadisticas, tendencias, selectedParameter, parameterLabel } = reportData;

    const stats = selectedParameter ? estadisticas?.[selectedParameter] : undefined;
    const trendData = selectedParameter ? tendencias?.[selectedParameter] : undefined;
    
    const getUnitForParameter = (param: string): string => {
        const units: { [key: string]: string } = {
            meltIndexCalculado: 'g/10min',
            meltIndexVariacion: '%',
            densidadCalculada: 'g/cm³',
            negroHumoCalculado: '%',
            resistencia_traccion: 'MPa',
            elongacion_rotura: '%',
            tio_tiempo: 'min',
        };
        return units[param] || '';
    };

    const parameterUnit = selectedParameter ? getUnitForParameter(selectedParameter) : '';

    return (
        <>
        <style>{`
            @media print {
                body, html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
        `}</style>
        <div className="bg-card text-card-foreground p-8 rounded-lg border font-body text-sm max-w-4xl mx-auto">
            <ReportHeader title="Certificado de Historial de Calidad" producto={producto} fecha={fechaGeneracion} />
            
            <SectionTitle title={`Resumen Estadístico: ${parameterLabel || 'Parámetro'}`} />
            {stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Promedio" value={formatValue(stats.promedio, 3)} unit={parameterUnit} icon={<Sigma size={14}/>} />
                    <StatCard title="Valor Máximo" value={formatValue(stats.max, 3)} unit={parameterUnit} icon={<ArrowUpWideNarrow size={14}/>} className="border-green-500/30 bg-green-500/5"/>
                    <StatCard title="Valor Mínimo" value={formatValue(stats.min, 3)} unit={parameterUnit} icon={<ArrowDownWideNarrow size={14}/>} className="border-red-500/30 bg-red-500/5"/>
                    <StatCard title="Desv. Estándar" value={formatValue(stats.desvEst, 3)} unit={parameterUnit} icon={<TrendingUp size={14}/>} />
                </div>
            ) : <p className="text-muted-foreground">No hay suficientes datos para estadísticas.</p>}

            <SectionTitle title={`Tendencia de ${parameterLabel || 'Parámetro'}`} />
            {trendData && trendData.length > 1 ? (
                <div className="w-full h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="fecha" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - (dataMax-dataMin)*0.1', 'dataMax + (dataMax-dataMin)*0.1']} tickFormatter={(v) => typeof v === 'number' ? v.toFixed(2) : v}/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}/>
                            <Legend verticalAlign="top" height={36} formatter={() => parameterLabel || ''} />
                            <Line type="monotone" dataKey="valor" name={parameterLabel} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : <p className="text-muted-foreground">No hay suficientes datos para mostrar una tendencia.</p>}
            

            <SectionTitle title="Historial de Ensayos" />
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader><TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>ID Ensayo</TableHead>
                        <TableHead className="text-right">M.I.</TableHead>
                        <TableHead className="text-right">Densidad</TableHead>
                        <TableHead className="text-right">% NH</TableHead>
                        <TableHead className="text-right">TIO</TableHead>
                        <TableHead className="text-right">Tracción</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                        {ensayos.map(e => (
                            <TableRow key={e.id} className={cn(selectedParameter && e[selectedParameter!] !== null && e[selectedParameter!] !== undefined && 'bg-primary/5')}>
                                <TableCell>{e.fecha}</TableCell>
                                <TableCell className="font-mono">{e.lote}</TableCell>
                                <TableCell className="font-mono">{e.id}</TableCell>
                                <TableCell className={cn("text-right font-mono", selectedParameter === 'meltIndexCalculado' && 'font-bold')}>{formatValue(e.meltIndexCalculado, 3)}</TableCell>
                                <TableCell className={cn("text-right font-mono", selectedParameter === 'densidadCalculada' && 'font-bold')}>{formatValue(e.densidadCalculada, 3)}</TableCell>
                                <TableCell className={cn("text-right font-mono", selectedParameter === 'negroHumoCalculado' && 'font-bold')}>{formatValue(e.negroHumoCalculado)}</TableCell>
                                <TableCell className={cn("text-right font-mono", selectedParameter === 'tio_tiempo' && 'font-bold')}>{formatValue(e.tio_tiempo)}</TableCell>
                                <TableCell className={cn("text-right font-mono", selectedParameter === 'resistencia_traccion' && 'font-bold')}>{formatValue(e.resistencia_traccion)}</TableCell>
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
      </>
    );
};
