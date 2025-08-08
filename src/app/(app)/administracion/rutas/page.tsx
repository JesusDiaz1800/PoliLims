
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link, Map } from "lucide-react";

const rutas = [
    '/dashboard',
    '/ensayos/control-rutinario',
    '/ensayos/tuberias/hdpe',
    '/ensayos/tuberias/pp',
    '/ensayos/materia-prima',
    '/ensayos/reprocesado',
    '/ensayos/seguimiento',
    '/equipos',
    '/equipos/control',
    '/equipos/programa',
    '/no-conformidades',
    '/importaciones',
    '/reports',
    '/biblioteca/documentos',
    '/biblioteca/upload',
    '/administracion/usuarios',
    '/administracion/configuracion',
    '/administracion/rutas',
];

export default function RutasPage() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rutas de Navegación Disponibles</CardTitle>
        <CardDescription>
            Esta es una lista de todas las páginas a las que el Asistente de IA puede navegar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <ul className="divide-y">
                {rutas.map((ruta) => (
                    <li key={ruta} className="px-4 py-3 flex items-center gap-3">
                        <Map className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-mono text-sm">{ruta}</span>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
