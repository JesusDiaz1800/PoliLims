import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles y Permisos',
};

export default function PermisosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Roles y Permisos</CardTitle>
        <CardDescription>Defina los roles de usuario y asigne permisos específicos para cada función en el sistema.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldCheck className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Gestión de Permisos Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección permitirá configurar los roles y permisos de los usuarios.</p>
      </CardContent>
    </Card>
  );
}
