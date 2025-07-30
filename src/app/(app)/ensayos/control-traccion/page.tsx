import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ControlRutinarioForm } from "@/components/ensayos/control-rutinario-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Control de Tracción',
};

export default function ControlTraccionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Control de Tracción y Producción</CardTitle>
        <CardDescription>Registro de control de calidad en línea y ensayos de tracción.</CardDescription>
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
