
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Loader2, AlertTriangle, FileText, Search } from 'lucide-react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { MateriaPrimaSelectionTable } from '@/components/reports/materia-prima-selection';
import { MateriaPrimaSummaryReport } from '@/components/reports/materia-prima-report';
import { generateMateriaPrimaReportAction } from './actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const initialState = { message: '', data: null, error: null };

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending}>
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


export default function MateriaPrimaBatchReportPage() {
  const { ensayos, isLoading } = useDynamicData();
  const [state, formAction] = useActionState(generateMateriaPrimaReportAction, initialState);
  const { toast } = useToast();
  
  const [selectedEnsayoIds, setSelectedEnsayoIds] = React.useState(new Set<string>());
  const [searchTerm, setSearchTerm] = React.useState('');

  const materiaPrimaEnsayos = React.useMemo(() => 
    ensayos.filter(e => e.tipo === 'Materia Prima' && e.estado === 'Aprobado')
  , [ensayos]);
  
  const filteredEnsayos = React.useMemo(() => {
    if (!searchTerm) return materiaPrimaEnsayos;
    return materiaPrimaEnsayos.filter(e => 
        (e.producto && e.producto.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.lote && e.lote.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [materiaPrimaEnsayos, searchTerm]);
  
  const selectedEnsayos = React.useMemo(() => 
    materiaPrimaEnsayos.filter(e => selectedEnsayoIds.has(e.id))
  , [materiaPrimaEnsayos, selectedEnsayoIds]);

  const handlePrint = () => {
    const printContents = document.getElementById("printable-report")?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  }

  const handleEmail = () => {
    if (state.data?.email) {
        const { to, cc, subject, htmlBody } = state.data.email;
        const mailtoLink = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`;
        window.location.href = mailtoLink;
    }
  }

  React.useEffect(() => {
    if(state.error) {
        toast({
            variant: "destructive",
            title: "Error al generar el informe",
            description: state.error,
        })
    }
  }, [state.error, toast]);


  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Generador de Informes de Materia Prima</CardTitle>
                    <CardDescription>
                        Seleccione los ensayos de materia prima aprobados que desea incluir en el informe de resumen.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por producto o lote..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {filteredEnsayos.length > 0 ? (
                        <MateriaPrimaSelectionTable 
                            ensayos={filteredEnsayos}
                            selectedIds={selectedEnsayoIds}
                            onSelectionChange={setSelectedEnsayoIds}
                        />
                    ) : (
                        <Alert>
                            <AlertTriangle className="h-4 w-4"/>
                            <AlertTitle>No se encontraron ensayos.</AlertTitle>
                            <AlertDescription>No hay ensayos de materia prima aprobados que coincidan con su búsqueda.</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter>
                    <input type="hidden" name="ensayos" value={JSON.stringify(selectedEnsayos)} />
                    <SubmitButton disabled={selectedEnsayoIds.size === 0} />
                </CardFooter>
            </Card>
        </form>

        {state.data?.report && (
             <Card>
                <CardHeader>
                    <CardTitle>Informe de Resultados Generado</CardTitle>
                    <CardDescription>
                        A continuación se muestra el informe de resumen. Puede imprimirlo o generar un borrador de correo electrónico.
                    </CardDescription>
                </CardHeader>
                <CardContent id="printable-report">
                    <MateriaPrimaSummaryReport reportData={state.data.report} />
                </CardContent>
                <CardFooter className="justify-end gap-4">
                    <Button variant="outline" onClick={handlePrint}>
                       <Printer className="mr-2 h-4 w-4" />
                       Imprimir Informe
                    </Button>
                     <Button onClick={handleEmail}>
                       <Mail className="mr-2 h-4 w-4" />
                       Abrir Borrador de Correo
                    </Button>
                </CardFooter>
            </Card>
        )}
    </div>
  );
}
