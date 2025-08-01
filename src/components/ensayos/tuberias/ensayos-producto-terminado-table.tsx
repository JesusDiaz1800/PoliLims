
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FilePlus2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Ensayo } from '@/context/data-context';

interface EnsayosProductoTerminadoTableProps {
  ensayos: Ensayo[];
  tipoEnsayo: 'HDPE' | 'PP';
  onOpenDialog: (ensayo: Ensayo) => void;
}

function getStatusInfo(status: Ensayo['estado']) {
  switch (status) {
    case 'Pendiente de Revisión':
      return {
        variant: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        icon: Clock,
        label: 'Pendiente',
      };
    case 'En Progreso':
      return {
        variant: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        icon: Clock,
        label: 'En Progreso',
      };
    case 'Aprobado':
      return {
        variant: 'bg-green-500/20 text-green-300 border-green-500/30',
        icon: CheckCircle,
        label: 'Aprobado',
      };
    default:
      return {
        variant: 'bg-secondary',
        icon: Clock,
        label: status,
      };
  }
}

export function EnsayosProductoTerminadoTable({ ensayos, tipoEnsayo, onOpenDialog }: EnsayosProductoTerminadoTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredEnsayos = ensayos.filter(ensayo =>
    (ensayo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ensayo.lote?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Ensayos de Laboratorio: Tuberías {tipoEnsayo}</CardTitle>
            <CardDescription>
              Muestras de tuberías {tipoEnsayo} recibidas desde Control Rutinario, pendientes de análisis.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, producto o lote..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Muestra</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Fecha de Ingreso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnsayos.map((ensayo) => {
              const statusInfo = getStatusInfo(ensayo.estado);
              return (
                <TableRow key={ensayo.id}>
                  <TableCell className="font-mono">{ensayo.id}</TableCell>
                  <TableCell className="font-medium">{ensayo.producto}</TableCell>
                  <TableCell>{ensayo.lote}</TableCell>
                  <TableCell>{ensayo.fecha}</TableCell>
                  <TableCell>
                    <Badge className={cn("border-transparent font-normal", statusInfo.variant)}>
                      <statusInfo.icon className="mr-1.5 h-3.5 w-3.5" />
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" onClick={() => onOpenDialog(ensayo)}>
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Ingresar Resultados
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredEnsayos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron ensayos pendientes</h3>
            <p>Las nuevas muestras aparecerán aquí cuando se envíen desde Control Rutinario.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
