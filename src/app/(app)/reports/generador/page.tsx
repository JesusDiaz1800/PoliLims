
"use client";

import * as React from 'react';
import { useDynamicData, type Ensayo } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, FileText, Loader2, Info, AlertTriangle, GanttChartSquare, ListChecks } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { generateReportAction, generateProductCertificateAction } from './actions';
import type { ReportData } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EnsayoSelectionTable } from '@/components/reports/ensayo-selection-table';
import { ReportContainer } from '@/components/reports/ReportContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox } from "@/components/ui/combobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


const initialState: {
  reportData: ReportData | null;
  error?: string | null;
} = {
  reportData: null,
};


function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                </>
            ) : (
                <>
                    {children}
                </>
            )}
        </Button>
    );
}

const parameterOptions = [
    { value: 'meltIndexCalculado', label: 'Melt Index (Producto Terminado)' },
    { value: 'meltIndexVariacion', label: 'Variación de Melt Index (%)' },
    { value: 'densidadCalculada', label: 'Densidad' },
    { value: 'negroHumoCalculado', label: '% Negro de Humo' },
    { value: 'resistencia_traccion', label: 'Resistencia a la Tracción' },
    { value: 'elongacion_rotura', label: 'Elongación de Ruptura' },
    { value: 'tio_tiempo', label: 'Tiempo de Inducción a la Oxidación (TIO)' },
];

export default function GeneradorInformesPage() {
  const { ensayos, isLoading } = useDynamicData();
  const [loteSelectionState, loteSelectionAction] = useActionState(generateReportAction, initialState);
  const [productCertState, productCertAction] = useActionState(generateProductCertificateAction, initialState);

  const [filterType, setFilterType] = React.useState("Materia Prima");
  const [selectedEnsayoIds, setSelectedEnsayoIds] = React.useState(new Set<string>());
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [selectedParameter, setSelectedParameter] = React.useState("meltIndexCalculado");


  const filteredEnsayos = React.useMemo(() => {
    return ensayos.filter(e => {
        const typeMatch = filterType === 'Todos' || e.tipo === filterType;
        const statusMatch = e.estado === 'Aprobado';
        return typeMatch && statusMatch;
    });
  }, [ensayos, filterType]);
  
  const ensayoTypes = React.useMemo(() => [
      'Materia Prima',
      'Reprocesado',
      'Tubería HDPE',
      'Tubería PP'
  ], []);

  const productOptions = React.useMemo(() => {
    const uniqueProducts = [...new Set(ensayos.map(e => e.producto))];
    return uniqueProducts.map(p => ({ value: p, label: p }));
  }, [ensayos]);


  const handlePrint = async () => {
    const printContent = document.getElementById('printable-report');
    if (!printContent) return;
    
    const activeReportData = loteSelectionState.reportData || productCertState.reportData;
    if (!activeReportData) return;

    const contentToPrint = printContent.innerHTML;
    const stylesheets = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          if (sheet.cssRules) {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('');
          }
          if (sheet.href) {
            return `<link rel="stylesheet" href="${sheet.href}">`;
          }
          return '';
        } catch (e) {
          console.warn("Could not read stylesheet rules. This may be due to CORS restrictions.", e);
          return '';
        }
      })
      .join('\n');
      
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Informe de Resultados</title>');
      
      if (stylesheets.includes('<link')) {
          printWindow.document.write(stylesheets);
      } else {
          printWindow.document.write('<style>');
          printWindow.document.write(stylesheets);
          printWindow.document.write('</style>');
      }

      printWindow.document.write('</head><body>');
      printWindow.document.write(contentToPrint);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const ReportPreview = ({ reportData, error }: { reportData: ReportData | null; error?: string | null }) => {
    if (!reportData && !error) return null;
    
    if (error) {
        return (
            <Alert variant="destructive" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Error al Generar</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }
    
    if (reportData) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Vista Previa del Documento</CardTitle>
                            <CardDescription>Revise el documento generado antes de imprimir.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handlePrint}>
                                <FileText className="mr-2 h-4 w-4" />
                                Imprimir Documento
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div id="printable-report">
                        <ReportContainer reportData={reportData}/>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Informes y Certificados</CardTitle>
          <CardDescription>
            Utilice las pestañas para elegir entre generar un informe de resultados a partir de una selección o un certificado histórico por producto.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="seleccion">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="seleccion"><ListChecks className="mr-2 h-4 w-4"/>Informe de Resultado de Ensayos</TabsTrigger>
                    <TabsTrigger value="historico"><GanttChartSquare className="mr-2 h-4 w-4"/>Certificado Histórico por Producto</TabsTrigger>
                </TabsList>
                
                <TabsContent value="seleccion" className="pt-4">
                    <form action={loteSelectionAction}>
                         <Card>
                            <CardHeader>
                                <CardTitle>Selección de Ensayos</CardTitle>
                                <CardDescription>Filtre y seleccione uno o varios ensayos aprobados para generar un informe consolidado.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <div className="flex flex-col md:flex-row items-center justify-start gap-2 w-full mb-4">
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="w-full md:w-[250px]">
                                            <SelectValue placeholder="Filtrar por tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ensayoTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <input type="hidden" name="selectedIds" value={JSON.stringify(Array.from(selectedEnsayoIds))} />
                                <input type="hidden" name="filterType" value={filterType} />

                                <EnsayoSelectionTable
                                    ensayos={filteredEnsayos}
                                    selectedIds={selectedEnsayoIds}
                                    onSelectionChange={setSelectedEnsayoIds}
                                />
                            </CardContent>
                            <CardFooter>
                                <SubmitButton>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generar Informe
                                </SubmitButton>
                            </CardFooter>
                        </Card>
                    </form>
                    <ReportPreview reportData={loteSelectionState.reportData} error={loteSelectionState.error} />
                </TabsContent>

                <TabsContent value="historico" className="pt-4">
                     <form action={productCertAction}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Generar Certificado Histórico</CardTitle>
                                <CardDescription>Seleccione un producto y un parámetro para generar un certificado con el historial completo de sus ensayos, estadísticas y tendencias.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Producto</Label>
                                        <Combobox
                                            options={productOptions}
                                            value={selectedProduct}
                                            onChange={setSelectedProduct}
                                            placeholder="Buscar producto..."
                                            notFoundText="No se encontró el producto."
                                        />
                                        <input type="hidden" name="producto" value={selectedProduct} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Parámetro a Analizar</Label>
                                        <Select name="parameter" value={selectedParameter} onValueChange={setSelectedParameter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un parámetro" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {parameterOptions.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <SubmitButton>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generar Certificado
                                </SubmitButton>
                            </CardFooter>
                        </Card>
                    </form>
                    <ReportPreview reportData={productCertState.reportData} error={productCertState.error}/>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
