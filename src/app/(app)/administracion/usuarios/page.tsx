import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios',
};

export default function UsuariosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Usuarios</CardTitle>
        <CardDescription>Administre el personal, sus roles y accesos al sistema.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Gestión de Usuarios Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección permitirá añadir, editar y eliminar usuarios del sistema.</p>
      </CardContent>
    </Card>
  );
}
