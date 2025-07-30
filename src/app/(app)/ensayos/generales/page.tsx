import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileSearch } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro de Ensayos Generales',
};

export default function EnsayosGeneralesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ensayos Generales</CardTitle>
        <CardDescription>
          Busque un registro de producción existente y añada los resultados de los ensayos de laboratorio correspondientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileSearch className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Búsqueda de Muestras Próximamente</h3>
        <p className="text-muted-foreground mt-2">
            Aquí podrá buscar un control rutinario por su ID o lote para añadirle los resultados de los ensayos de laboratorio.
        </p>
      </CardContent>
    </Card>
  );
}
