import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { RegistroEnsayoForm } from "@/components/ensayos/registro-ensayo-form";
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
                { value: "porcentaje_negro_humo", label: "Porcentaje de Negro de Humo" },
                { value: "tio", label: "TIO" },
                { value: "porcentaje_cenizas", label: "Porcentaje de Cenizas" },
            ]}
        />
      </CardContent>
    </Card>
  );
}
