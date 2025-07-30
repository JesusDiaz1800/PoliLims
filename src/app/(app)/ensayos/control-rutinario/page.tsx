import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control Rutinario de Tuberías',
};

export default function ControlRutinarioPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Rutinario de Tuberías</CardTitle>
        <CardDescription>Registro diario de control de calidad realizado por los inspectores.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <ClipboardCheck className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Formulario de Control Rutinario Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección contendrá el formulario detallado para el registro de control rutinario.</p>
      </CardContent>
    </Card>
  );
}
