
"use client";

import * as React from "react";
import { useDynamicData } from "@/context/data-context";
import type { Ensayo } from "@/context/data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer, Search, FileText } from "lucide-react";
import { CoAReport } from "@/components/reports/coa-report";
import Loading from "../loading";
import { useToast } from "@/hooks/use-toast";

export default function ReportsPage() {
  const { ensayos, isLoading } = useDynamicData();
  const { toast } = useToast();
  const [selectedEnsayoId, setSelectedEnsayoId] = React.useState<string | null>(null);
  const [reportData, setReportData] = React.useState<Ensayo | null>(null);

  const productEnsayos = React.useMemo(() => 
    ensayos.filter(e => e.tipo.startsWith('Tubería') && e.estado === 'Aprobado')
  , [ensayos]);

  const handleGenerateReport = () => {
    if (!selectedEnsayoId) {
      toast({
        variant: "destructive",
        title: "Selección requerida",
        description: "Por favor, seleccione un ensayo para generar el informe.",
      });
      return;
    }
    const ensayo = productEnsayos.find(e => e.id === selectedEnsayoId);
    setReportData(ensayo || null);
  };
  
  const handlePrint = () => {
    const printContents = document.getElementById("printable-coa")?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore original state
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generación de Informes y Certificados</CardTitle>
          <CardDescription>
            Seleccione un ensayo de producto terminado aprobado para generar su
            Certificado de Análisis (CoA).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={setSelectedEnsayoId} value={selectedEnsayoId || ''}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccione un ensayo aprobado..." />
              </SelectTrigger>
              <SelectContent>
                {productEnsayos.map((ensayo) => (
                  <SelectItem key={ensayo.id} value={ensayo.id}>
                    {`${ensayo.id} - ${ensayo.producto} (Lote: ${ensayo.lote})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Generar Vista Previa
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Certificado de Análisis: {reportData.id}</CardTitle>
                <CardDescription>
                    Vista previa del certificado. Verifique la información antes de imprimir.
                </CardDescription>
            </div>
             <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir Certificado
            </Button>
          </CardHeader>
          <CardContent>
            <div id="printable-coa">
                <CoAReport data={reportData} />
            </div>
          </CardContent>
        </Card>
      ) : (
         <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2 rounded-lg">
            <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold font-headline">No hay informe que mostrar</h3>
            <p className="text-muted-foreground mt-2">Seleccione un ensayo y genere la vista previa para ver el certificado aquí.</p>
        </div>
      )}
    </div>
  );
}
