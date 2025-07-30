import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RegistroEnsayoForm } from "@/components/ensayos/registro-ensayo-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registrar Ensayo',
};

export default function RegistrarEnsayoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Nuevo Ensayo</CardTitle>
        <CardDescription>Complete el siguiente formulario para registrar un nuevo ensayo en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegistroEnsayoForm />
      </CardContent>
    </Card>
  );
}
