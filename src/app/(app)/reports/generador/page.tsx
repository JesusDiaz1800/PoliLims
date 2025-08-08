
"use client";

import * as React from 'react';
import { useDynamicData, type Ensayo } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, FileText, Loader2, Info } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { MateriaPrimaSelectionTable } from '@/components/reports/materia-prima-selection';
import { MateriaPrimaSummaryReport } from '@/components/reports/materia-prima-report';
import { generateMateriaPrimaReportAction } from './actions';
import type { ReportData } from './actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const initialState: {
  reportData: ReportData | null;
  emailBody: string | null;
  emailSubject: string | null;
  error?: string | null;
} = {
  reportData: null,
  emailBody: null,
  emailSubject: null,
};

function SubmitButton() {
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
                    <FileText className="mr-2 h-4 w-4" />
                    Generar Informe y Correo
                </>
            )}
        </Button>
    );
}

export default function GeneradorInformesPage() {
  const { ensayos, isLoading } = useDynamicData();
  const [reportState, formAction] = useActionState(generateMateriaPrimaReportAction, initialState);
  
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Materia Prima");
  const [selectedEnsayoIds, setSelectedEnsayoIds] = React.useState(new Set<string>());

  const filteredEnsayos = React.useMemo(() => {
    return ensayos.filter(e => {
        const typeMatch = filterType === 'Todos' || e.tipo === filterType;
        const searchMatch = !searchTerm || e.producto.toLowerCase().includes(searchTerm.toLowerCase()) || (e.lote && e.lote.toLowerCase().includes(searchTerm.toLowerCase()));
        const statusMatch = e.estado === 'Aprobado';
        return typeMatch && searchMatch && statusMatch;
    });
  }, [ensayos, filterType, searchTerm]);
  
  const ensayoTypes = React.useMemo(() => [
      'Materia Prima',
      'Reprocesado',
      'Tubería HDPE',
      'Tubería PP'
  ], []);

  const handleOpenEmail = () => {
    if (reportState?.emailBody && reportState?.emailSubject) {
        const to = "jtapia@polifusion.cl; amendez@polifusion.cl; pestay@polifusion.cl";
        const cc = "afigueroa@polifusion.cl; cmunizaga@polifusion.cl; vlutz@polifusion.cl; mgallardo@polifusion.cl; ccalidad4@polifusion.cl; rcruz@polifusion.cl";

        const mailtoLink = `mailto:${encodeURIComponent(to)}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(reportState.emailSubject)}&body=${encodeURIComponent(reportState.emailBody)}`;
        window.location.href = mailtoLink;
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById("printable-report")?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
            try {
                return Array.from(styleSheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('');
            } catch (e) {
                console.warn('Could not read stylesheet rules', e);
                return '';
            }
        }).join('\n');

      const printWindow = window.open('', '', 'height=800,width=800');
      printWindow?.document.write('<html><head><title>Imprimir Informe</title>');
      printWindow?.document.write('<style>');
      printWindow?.document.write(styles);
      printWindow?.document.write('</style></head><body>');
      printWindow?.document.write(printContents);
      printWindow?.document.write('</body></html>');
      printWindow?.document.close();
      printWindow?.print();
    }
  }


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Informes y Correos</CardTitle>
          <CardDescription>
            Seleccione uno o varios ensayos para generar un informe consolidado y un borrador de correo electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction}>
                 <div className="flex flex-col md:flex-row items-center justify-start gap-2 w-full mb-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full md:w-[250px]">
                            <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            {ensayoTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="relative w-full md:w-auto flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por producto o lote..."
                            className="pl-9 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <input type="hidden" name="selectedIds" value={JSON.stringify(Array.from(selectedEnsayoIds))} />
                <input type="hidden" name="filterType" value={filterType} />

                <MateriaPrimaSelectionTable
                    ensayos={filteredEnsayos}
                    selectedIds={selectedEnsayoIds}
                    onSelectionChange={setSelectedEnsayoIds}
                />
                
                <div className="flex justify-end pt-6">
                    <SubmitButton />
                </div>
            </form>
        </CardContent>
      </Card>

      {reportState?.reportData && (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Vista Previa del Informe</CardTitle>
                        <CardDescription>Revise el informe generado antes de imprimir o enviar.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Button onClick={handleOpenEmail} variant="outline">
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar por Correo
                        </Button>
                        <Button onClick={handlePrint}>
                            <FileText className="mr-2 h-4 w-4" />
                            Imprimir Informe
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div id="printable-report">
                    <MateriaPrimaSummaryReport reportData={reportState.reportData}/>
                </div>
            </CardContent>
        </Card>
      )}

      {reportState?.error && (
        <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error al Generar</AlertTitle>
            <AlertDescription>
                {reportState.error}
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
