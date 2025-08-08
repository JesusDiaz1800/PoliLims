
"use client";

import * as React from 'react';
import { useActionState } from 'react';
import { useDynamicData, type Ensayo } from '@/context/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MateriaPrimaSelectionTable } from '@/components/reports/materia-prima-selection';
import { MateriaPrimaSummaryReport } from '@/components/reports/materia-prima-report';
import { generateReportAndEmailAction, type ReportState } from './actions';
import { Loader2, Mail, Send, FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Loading from '../../loading';

const initialState: ReportState = {
  message: '',
  data: null,
  error: null,
};

export default function MateriaPrimaBatchReportPage() {
  const { ensayos, isLoading } = useDynamicData();
  const { toast } = useToast();
  const [selectedEnsayoIds, setSelectedEnsayoIds] = React.useState<Set<string>>(new Set());
  const [state, formAction, isPending] = useActionState(generateReportAndEmailAction, initialState);

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error al generar el informe',
        description: state.error,
      });
    }
  }, [state, toast]);

  const materiaPrimaEnsayos = React.useMemo(() => 
    ensayos.filter(e => e.tipo === 'Materia Prima' && e.estado === 'Aprobado')
  , [ensayos]);
  
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
  };
  
  const handleSendEmail = () => {
      if (!state.data?.email) return;

      const { to, cc, subject, htmlBody } = state.data.email;
      const mailtoLink = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`;

      // This will open the user's default email client
      window.location.href = mailtoLink;
  }

  if (isLoading) {
      return <Loading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informe por Lotes de Materia Prima</CardTitle>
          <CardDescription>
            Seleccione los ensayos de materia prima aprobados que desea incluir en el informe de resumen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <input type="hidden" name="ensayos" value={JSON.stringify(selectedEnsayos)} />
            <MateriaPrimaSelectionTable
              ensayos={materiaPrimaEnsayos}
              selectedIds={selectedEnsayoIds}
              onSelectionChange={setSelectedEnsayoIds}
            />
            <div className="flex justify-end mt-4">
              <Button type="submit" disabled={selectedEnsayoIds.size === 0 || isPending}>
                {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                ) : (
                    <><Send className="mr-2 h-4 w-4" /> Generar Informe y Correo</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {state.data?.report && (
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Informe de Resumen Generado</CardTitle>
                    <CardDescription>
                        Vista previa del informe. Verifique los promedios y detalles antes de imprimir o enviar.
                    </CardDescription>
                </div>
                <div className='flex gap-2'>
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Imprimir Informe
                    </Button>
                     <Button onClick={handleSendEmail}>
                        <Mail className="mr-2 h-4 w-4" /> Abrir Borrador de Correo
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div id="printable-report">
                    <MateriaPrimaSummaryReport 
                        reportData={state.data.report}
                    />
                </div>
            </CardContent>
        </Card>
      )}

      {!state.data?.report && !isPending && (
         <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2 rounded-lg">
            <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold font-headline">Esperando Selección</h3>
            <p className="text-muted-foreground mt-2">Seleccione uno o más ensayos y genere el informe para verlo aquí.</p>
        </div>
      )}
    </div>
  );
}
