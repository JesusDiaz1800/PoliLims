import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FilePlus2 } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrar Ensayo',
};

export default function RegistrarEnsayoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Nuevo Ensayo</CardTitle>
        <CardDescription>Formulario para ingresar los detalles de un nuevo ensayo.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FilePlus2 className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Formulario de Registro Próximamente</h3>
        <p className="text-muted-foreground mt-2">Aquí podrá registrar nuevos ensayos en el sistema.</p>
      </CardContent>
    </Card>
  );
}
