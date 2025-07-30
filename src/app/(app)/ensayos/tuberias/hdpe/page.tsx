import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RegistroEnsayoForm } from "@/components/ensayos/registro-ensayo-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ensayos de Tuberías HDPE',
};

export default function TuberiasHdpePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ensayo: Tuberías HDPE</CardTitle>
        <CardDescription>Complete el formulario para registrar un ensayo de tuberías HDPE.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegistroEnsayoForm 
            analistas={[
                { value: "jesus.diaz", label: "Jesus Diaz" },
                { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
                { value: "antonia.figueroa", label: "Antonia Figueroa" },
                { value: "robinson.cordova", label: "Robinson Córdova" },
                { value: "bryan.vasquez", label: "Bryan Vásquez" },
            ]}
            ensayos={[
                { value: "melt_index", label: "Melt Index" },
                { value: "densidad", label: "Densidad" },
                { value: "resistencia_phi", label: "Resistencia PHI" },
                { value: "traccion", label: "Tracción" },
                { value: "porcentaje_negro_humo", label: "Porcentaje Negro de Humo" },
                { value: "dispersion_negro_humo", label: "Dispersión Negro de Humo" },
            ]}
        />
      </CardContent>
    </Card>
  );
}
