
"use client";

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { EnsayoPHI } from '@/context/data-context';
import { PhiProgressBar } from './phi-progress-bar';
import { PhiTimer } from './phi-timer';
import { format, parse } from 'date-fns';

interface PhiTableProps {
  data: EnsayoPHI[];
}

const CalculoFechaFin = ({ fechaInicio, horas }: { fechaInicio: string, horas: number }) => {
    const [fechaFin, setFechaFin] = React.useState('Calculando...');

    React.useEffect(() => {
        const inicio = new Date(fechaInicio);
        if (!isNaN(inicio.getTime())) {
            const fechaFinEstimada = new Date(inicio.getTime() + horas * 60 * 60 * 1000);
            setFechaFin(format(fechaFinEstimada, 'dd-MM-yyyy HH:mm'));
        } else {
            setFechaFin('Fecha inválida');
        }
    }, [fechaInicio, horas]);

    return <span>{fechaFin}</span>;
};


export function PhiTable({ data }: PhiTableProps) {
  const sortedData = [...data].sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fila</TableHead>
            <TableHead>Fecha Ingreso</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Raya</TableHead>
            <TableHead>Horas</TableHead>
            <TableHead>Fecha Final Estimada</TableHead>
            <TableHead>% Progreso</TableHead>
            <TableHead>Tiempo Restante</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((ensayo, index) => {
            return (
            <TableRow key={ensayo.id}>
              <TableCell className="font-mono">{15 + index}</TableCell>
              <TableCell>{ensayo.fechaIngresoManual || 'N/A'}</TableCell>
              <TableCell>{format(new Date(ensayo.fechaInicio), 'dd-MM-yyyy HH:mm:ss')}</TableCell>
              <TableCell className="font-medium max-w-xs truncate">{ensayo.producto}</TableCell>
              <TableCell>
                <Badge style={{ backgroundColor: ensayo.raya.toLowerCase() }} className="text-white">{ensayo.raya}</Badge>
              </TableCell>
              <TableCell>{ensayo.horas}</TableCell>
              <TableCell>
                  <CalculoFechaFin fechaInicio={ensayo.fechaInicio} horas={ensayo.horas} />
              </TableCell>
              <TableCell className="w-[150px]">
                <PhiProgressBar
                    fechaInicio={ensayo.fechaInicio}
                    horas={ensayo.horas}
                    isComplete={ensayo.estado !== 'EN PROCESO'}
                />
              </TableCell>
              <TableCell>
                <PhiTimer 
                    fechaInicio={ensayo.fechaInicio} 
                    horas={ensayo.horas} 
                    isComplete={ensayo.estado !== 'EN PROCESO'}
                />
              </TableCell>
              <TableCell>
                 <Badge variant={ensayo.estado === 'FINALIZADO' ? 'default' : 'secondary'}
                   className={ensayo.estado === 'FINALIZADO' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'}
                 >
                    {ensayo.estado}
                </Badge>
              </TableCell>
              <TableCell className={ensayo.resultado?.includes('Con fallas') ? 'text-red-500 font-bold' : ''}>
                {ensayo.resultado || '---'}
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}
