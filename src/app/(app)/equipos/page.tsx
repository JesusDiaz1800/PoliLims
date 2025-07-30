import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Beaker } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Equipos',
};

export default function EquiposPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Equipos</CardTitle>
        <CardDescription>Administre el inventario, calibración y mantenimiento de los equipos.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Beaker className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Gestión de Equipos Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección permitirá administrar todos los equipos del laboratorio.</p>
      </CardContent>
    </Card>
  );
}
