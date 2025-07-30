import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ReprocesadoForm } from "@/components/ensayos/reprocesado-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ensayos de Reprocesado',
};

export default function ReprocesadoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ensayo: Reprocesado</CardTitle>
        <CardDescription>Complete el formulario para registrar un ensayo de material reprocesado.</CardDescription>
      </CardHeader>
      <CardContent>
        <ReprocesadoForm
            analistas={[
                { value: "jesus.diaz", label: "Jesus Diaz" },
                { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
                { value: "antonia.figueroa", label: "Antonia Figueroa" },
                { value: "robinson.cordova", label: "Robinson Córdova" },
                { value: "bryan.vasquez", label: "Bryan Vásquez" },
            ]}
        />
      </CardContent>
    </Card>
  );
}
