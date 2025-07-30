import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ControlRutinarioForm } from "@/components/ensayos/control-rutinario-form";
import type { Metadata } from 'next';
import { matrizProductos } from "@/lib/matriz-datos";

export const metadata: Metadata = {
  title: 'Control Rutinario de Tuberías',
};

export default function ControlRutinarioPage() {
  const inspectores = [
    { value: "elias.ibanez", label: "Elias Ibañez" },
    { value: "cristian.montellano", label: "Cristian Montellano" },
    { value: "daniel.palma", label: "Daniel Palma" },
    { value: "luis.parada", label: "Luis Parada" },
  ];

  const maquinistas = [
    { value: "andres.reyes", label: "Andrés Reyes" },
    { value: "alexis.sandoval", label: "Alexis Sandoval" },
    { value: "carlos.dominguez", label: "Carlos Domínguez" },
    { value: "cristian.duque", label: "Cristian Duque" },
    { value: "eliaxer.bustos", label: "Eliaxer Bustos" },
    { value: "ignacio.herrera", label: "Ignacio Herrera" },
    { value: "joniel.joseph", label: "Joniel Joseph" },
    { value: "jorge.garcia", label: "Jorge García" },
    { value: "moises.fernandez", label: "Moises Fernandez" },
    { value: "ramon.salgado", label: "Ramón Salgado" },
    { value: "sebastian.serra", label: "Sebastián Serra" },
    { value: "segundo.pichilef", label: "Segundo Pichilef" },
    { value: "phaniel.phariluz", label: "Phaniel Phariluz" },
  ];

  const maquinas = [
    { value: "0", label: "Máquina 0" },
    { value: "2", label: "Máquina 2" },
    { value: "3", label: "Máquina 3" },
    { value: "4", label: "Máquina 4" },
    { value: "5", label: "Máquina 5" },
    { value: "6", label: "Máquina 6" },
    { value: "7", label: "Máquina 7" },
    { value: "8", label: "Máquina 8" },
    { value: "9", label: "Máquina 9" },
    { value: "10", label: "Máquina 10" },
    { value: "11", label: "Máquina 11" },
    { value: "PE1", label: "PE1" },
    { value: "PE2", label: "PE2" },
    { value: "PE3", label: "PE3" },
    { value: "PE4", label: "PE4" },
  ];

  const productos = matrizProductos.map(p => ({ value: p.producto, label: p.producto }));
  
  const marcas = [
    { value: "polifusion", label: "POLIFUSIÓN S.A." },
    { value: "smartpipes", label: "SMART PIPES SpA" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Control Rutinario de Tuberías</CardTitle>
        <CardDescription>Registro diario de control de calidad realizado por los inspectores en la línea de producción.</CardDescription>
      </CardHeader>
      <CardContent>
        <ControlRutinarioForm
          inspectores={inspectores}
          maquinistas={maquinistas}
          maquinas={maquinas}
          productos={productos}
          marcas={marcas}
        />
      </CardContent>
    </Card>
  );
}
