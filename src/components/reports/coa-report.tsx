
import * as React from 'react';
import type { Ensayo } from '@/context/data-context';
import { LogoAlt } from '@/components/logo-alt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CoAReportProps {
  data: Ensayo;
}

const ReportHeader = () => (
    <div className="flex justify-between items-center pb-4 border-b-2 border-primary">
        <div className="w-48">
            <LogoAlt />
        </div>
        <div className="text-right">
            <h1 className="text-2xl font-bold text-primary font-headline">Certificado de Análisis</h1>
            <p className="text-sm text-muted-foreground">Documento N°: {`COA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`}</p>
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
            </TableRow>
        </TableHeader>
        <TableBody>
            {results.map(res => (
                <TableRow key={res.parameter}>
                    <TableCell className="font-medium">{res.parameter}</TableCell>
                    <TableCell className="text-right font-mono">{res.value}</TableCell>
                    <TableCell>{res.unit}</TableCell>
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
    { parameter: 'Índice de Fluidez (Melt Index)', value: formatValue(data.meltIndexCalculado, 4), unit: 'g/10min' },
    { parameter: 'Variación de Melt Index', value: formatValue(data.meltIndexVariacion, 2), unit: '%' },
    { parameter: 'Densidad', value: formatValue(data.densidadCalculada, 4), unit: 'g/cm³' },
    ...(data.tipo === 'Tubería HDPE' ? [
        { parameter: '% Negro de Humo', value: formatValue(data.negroHumoCalculado, 2), unit: '%' },
        { parameter: 'Resistencia a la Tracción', value: formatValue(data.resistencia_traccion), unit: 'MPa' },
        { parameter: 'Elongación a la Rotura', value: formatValue(data.elongacion_rotura), unit: '%' },
        { parameter: 'Tiempo de Inducción a la Oxidación (TIO)', value: formatValue(data.tio_tiempo), unit: 'min' },
    ] : []),
    ...(data.tipo === 'Tubería PP' ? [
        { parameter: '% Fibra de Vidrio (Total)', value: formatValue(data.fvTotalPorcentaje, 2), unit: '%' },
        { parameter: '% Fibra de Vidrio (Capa Intermedia)', value: formatValue(data.fvIntermediaPorcentaje, 2), unit: '%' },
    ] : []),
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

      <div className="grid grid-cols-2 gap-x-12 mt-6">
        <div>
          <SectionTitle title="Información del Cliente" />
          <DetailRow label="Empresa" value="Polifusión S.A." />
          <DetailRow label="Atención" value="Control de Calidad" />
          <DetailRow label="Dirección" value="Av. La Montaña 1760, Lampa, RM" />
        </div>
        <div>
          <SectionTitle title="Información de la Muestra" />
          <DetailRow label="ID de Ensayo" value={<span className="font-mono">{data.id}</span>} />
          <DetailRow label="ID Muestra de Producción" value={<span className="font-mono">{data.id_muestra}</span>} />
          <DetailRow label="Producto" value={data.producto} />
          <DetailRow label="Lote" value={data.lote} />
        </div>
      </div>
      
      <SectionTitle title="Resultados de Ensayos de Laboratorio" />
      <div className="border rounded-lg overflow-hidden">
        <ResultsTable results={results} />
      </div>

      <div className="grid grid-cols-2 gap-x-12 mt-6">
          <div>
              <SectionTitle title="Veredicto Final" />
              <div className="p-4 rounded-lg bg-green-100 text-green-800 text-center">
                  <h3 className="font-bold text-lg">APROBADO</h3>
                  <p>La muestra cumple con las especificaciones de calidad.</p>
              </div>
          </div>
           <div>
              <SectionTitle title="Observaciones" />
              <p className="text-muted-foreground text-xs italic">
                {data.observaciones || "Sin observaciones adicionales."}
              </p>
          </div>
      </div>
      
      <div className="mt-20 pt-4 border-t text-center">
        <p className="font-semibold">{data.analista}</p>
        <p className="text-sm text-muted-foreground border-t-2 border-dotted w-1/2 mx-auto pt-1 mt-1">Firma Analista de Calidad</p>
      </div>

       <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Polifusión S.A. | Laboratorio de Control de Calidad</p>
        <p>Fecha de Emisión del Informe: {new Date().toLocaleDateString('es-CL')}</p>
      </div>
    </div>
  );
};
