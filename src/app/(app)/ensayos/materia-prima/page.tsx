import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MateriaPrimaForm } from "@/components/ensayos/materia-prima-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ensayos de Materia Prima',
};

export default function MateriaPrimaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Ensayo: Materia Prima</CardTitle>
        <CardDescription>Complete el formulario para registrar un ensayo de materia prima.</CardDescription>
      </CardHeader>
      <CardContent>
        <MateriaPrimaForm
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
