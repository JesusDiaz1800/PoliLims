import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FlaskConical } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Muestras',
};

export default function MuestrasPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Muestras</CardTitle>
        <CardDescription>Administre el inventario y el ciclo de vida de las muestras.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FlaskConical className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Gestión de Muestras Próximamente</h3>
        <p className="text-muted-foreground mt-2">Aquí podrá registrar, rastrear y gestionar todas las muestras del laboratorio.</p>
      </CardContent>
    </Card>
  );
}
