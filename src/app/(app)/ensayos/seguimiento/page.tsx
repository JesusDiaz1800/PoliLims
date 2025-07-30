import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguimiento de Ensayos',
};

export default function SeguimientoEnsayosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento de Ensayos</CardTitle>
        <CardDescription>Visualice el estado y progreso de todos los ensayos registrados.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <ClipboardList className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Tabla de Seguimiento Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección mostrará una lista de todos los ensayos y su estado actual.</p>
      </CardContent>
    </Card>
  );
}
