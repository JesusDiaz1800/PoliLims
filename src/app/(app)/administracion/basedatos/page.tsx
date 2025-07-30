import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración de Base de Datos',
};

export default function BaseDatosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Administración de Base de Datos</CardTitle>
        <CardDescription>Herramientas para gestionar, respaldar y mantener la base de datos del sistema.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Database className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Gestión de Base de Datos Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección proporcionará herramientas para la administración de la base de datos.</p>
      </CardContent>
    </Card>
  );
}
