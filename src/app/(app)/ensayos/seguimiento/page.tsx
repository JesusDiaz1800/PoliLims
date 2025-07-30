import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguimiento de Ensayos',
};

const ensayos = [
  {
    id: "MP-001",
    tipo: "Materia Prima",
    analista: "Jesus Diaz",
    fecha: "2024-07-22",
    estado: "Aprobado"
  },
  {
    id: "HDPE-0821-A",
    tipo: "Tubería HDPE",
    analista: "Maximiliano Miranda",
    fecha: "2024-07-21",
    estado: "En Progreso"
  },
  {
    id: "PP-559",
    tipo: "Tubería PP",
    analista: "Antonia Figueroa",
    fecha: "2024-07-21",
    estado: "Rechazado"
  },
  {
    id: "REPRO-034",
    tipo: "Reprocesado",
    analista: "Robinson Córdova",
    fecha: "2024-07-20",
    estado: "Pendiente de Revisión"
  },
    {
    id: "ACC-012",
    tipo: "Control de Accesorios",
    analista: "Bryan Vásquez",
    fecha: "2024-07-19",
    estado: "Aprobado"
  },
];

function getStatusVariant(status: string) {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-300 border-green-500/30";
        case "En Progreso": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
        case "Rechazado": return "bg-red-500/20 text-red-300 border-red-500/30";
        case "Pendiente de Revisión": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
        default: return "bg-secondary";
    }
}


export default function SeguimientoEnsayosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento de Ensayos</CardTitle>
        <CardDescription>Visualice el estado y progreso de todos los ensayos registrados en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Muestra</TableHead>
              <TableHead>Tipo de Ensayo</TableHead>
              <TableHead>Analista Asignado</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ensayos.map((ensayo) => (
              <TableRow key={ensayo.id}>
                <TableCell className="font-mono">{ensayo.id}</TableCell>
                <TableCell className="font-medium">{ensayo.tipo}</TableCell>
                <TableCell>{ensayo.analista}</TableCell>
                <TableCell>{ensayo.fecha}</TableCell>
                <TableCell className="text-center">
                  <Badge className={cn("border-transparent", getStatusVariant(ensayo.estado))}>
                    {ensayo.estado}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Imprimir Certificado</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
