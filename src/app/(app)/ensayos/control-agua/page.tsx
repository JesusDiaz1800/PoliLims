import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Agua',
};

export default function ControlAguaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control de Agua</CardTitle>
        <CardDescription>Registre los controles de calidad del agua utilizada en los procesos.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Droplets className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Formulario de Control de Agua Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección contendrá el formulario para el registro de control de agua.</p>
      </CardContent>
    </Card>
  );
}
