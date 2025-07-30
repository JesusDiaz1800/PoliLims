import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Accesorios',
};

export default function ControlAccesoriosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control de Accesorios</CardTitle>
        <CardDescription>Registre y consulte los controles de calidad para accesorios.</CardDescription>
      </CardHeader>
       <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Wrench className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Formulario de Control de Accesorios Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección contendrá el formulario detallado para el registro de control de accesorios.</p>
      </CardContent>
    </Card>
  );
}
