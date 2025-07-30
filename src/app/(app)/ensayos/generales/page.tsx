import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EnsayosGeneralesForm } from "@/components/ensayos/ensayos-generales-form";
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
          Busque un registro de producción existente y añada los resultados de los ensayos de laboratorio correspondientes, como Contracción, Impacto o PHI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: Add search functionality for production records */}
        <EnsayosGeneralesForm />
      </CardContent>
    </Card>
  );
}
