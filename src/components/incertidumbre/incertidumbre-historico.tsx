
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { CalculoIncertidumbre } from "@/context/data-context";
import { format } from "date-fns";

interface HistoricoIncertidumbreProps {
  calculos: CalculoIncertidumbre[];
}

const CalculoRow = ({ calculo }: { calculo: CalculoIncertidumbre }) => {
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        // This effect runs only on the client, after hydration.
        // This ensures the server and client render match initially.
        setFormattedDate(format(new Date(calculo.fecha), 'dd-MM-yyyy HH:mm'));
    }, [calculo.fecha]);

    return (
        <TableRow>
            <TableCell className="font-medium">{calculo.nombre}</TableCell>
            <TableCell>{formattedDate || 'Cargando...'}</TableCell>
            <TableCell>{calculo.usuario}</TableCell>
            <TableCell className="text-right font-mono">{calculo.resultado.incertidumbreCombinada.toExponential(4)}</TableCell>
            <TableCell className="text-right font-mono font-bold text-primary">{calculo.resultado.incertidumbreExpandida.toExponential(4)}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem><FileText className="mr-2 h-4 w-4" />Ver Reporte PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    )
}

export function HistoricoIncertidumbre({ calculos }: HistoricoIncertidumbreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Cálculos de Incertidumbre</CardTitle>
        <CardDescription>Registro de todos los cálculos de incertidumbre realizados y guardados en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre del Cálculo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead className="text-right">Incertidumbre Combinada (uc)</TableHead>
                        <TableHead className="text-right">Incertidumbre Expandida (U)</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {calculos.map((calculo) => (
                        <CalculoRow key={calculo.id} calculo={calculo} />
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
