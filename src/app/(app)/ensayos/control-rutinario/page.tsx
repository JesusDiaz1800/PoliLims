import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ControlRutinarioForm } from "@/components/ensayos/control-rutinario-form";
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
      <CardContent>
        <ControlRutinarioForm 
           inspectores={[
              { value: "daniel.palma", label: "Daniel Palma" },
              { value: "elias.ibanez", label: "Elias Ibañez" },
              { value: "cristian.montellano", label: "Cristian Montellano" },
              { value: "luis.parada", label: "Luis Parada" },
           ]}
        />
      </CardContent>
    </Card>
  );
}
