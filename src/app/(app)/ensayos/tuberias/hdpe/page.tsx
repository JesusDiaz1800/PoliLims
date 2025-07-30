import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TuberiasHdpeForm } from "@/components/ensayos/tuberias-hdpe-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ensayos de Tuberías HDPE',
};

export default function TuberiasHdpePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ensayo: Producto Terminado (HDPE)</CardTitle>
        <CardDescription>Complete el formulario para registrar un ensayo de tuberías HDPE.</CardDescription>
      </CardHeader>
      <CardContent>
        <TuberiasHdpeForm 
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
