
"use client";

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { EnsayoPHI } from '@/context/data-context';
import { PhiProgressBar } from './phi-progress-bar';
import { PhiTimer } from './phi-timer';
import { format, addHours, parseISO } from 'date-fns';
import { History, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface PhiTableProps {
  data: EnsayoPHI[];
}

const FechaCell = ({ fechaISO }: { fechaISO: string }) => {
    const [formattedDate, setFormattedDate] = React.useState('Cargando...');
    React.useEffect(() => {
        try {
            setFormattedDate(format(parseISO(fechaISO), 'dd/MM/yyyy HH:mm:ss'));
        } catch {
            setFormattedDate('Fecha inválida');
        }
    }, [fechaISO]);
    return <>{formattedDate}</>;
};

const FechaFinCell = ({ fechaInicioISO, horas }: { fechaInicioISO: string, horas: number }) => {
    const [formattedDate, setFormattedDate] = React.useState('Calculando...');
    React.useEffect(() => {
        try {
            const fechaFin = addHours(parseISO(fechaInicioISO), horas);
            setFormattedDate(format(fechaFin, 'dd/MM/yyyy HH:mm:ss'));
        } catch {
             setFormattedDate('Fecha inválida');
        }
    }, [fechaInicioISO, horas]);
    return <>{formattedDate}</>;
}

const handleEmailClick = (ensayo: EnsayoPHI) => {
    const inicio = new Date(ensayo.fechaInicio);
    const ahora = new Date();
    const transcurridoMilisegundos = ahora.getTime() - inicio.getTime();
    const transcurridoHoras = transcurridoMilisegundos / (1000 * 60 * 60);

    const fechaFinEstimada = new Date(inicio.getTime() + ensayo.horas * 60 * 60 * 1000);
    
    const to = 'vlutz@polifusion.cl;cmunizaga@polifusion.cl;juribe@smartpipes.cl';
    const subject = `Solicitud de Liberación: Ensayo ${ensayo.producto}`;

    const saludo = 'Favor liberar tuberías.';

    const horasTranscurridasTexto = 'Ensayo Completo';

    const body = `
${saludo}

--------------------------------------------------
Producto: ${ensayo.producto}
Inicio Ensayo: ${format(inicio, 'dd-MM-yyyy HH:mm')}
Fin Estimado: ${format(fechaFinEstimada, 'dd-MM-yyyy HH:mm')}
Horas Totales: ${ensayo.horas}
Horas Transcurridas: ${horasTranscurridasTexto}
Color de Raya: ${ensayo.raya}
--------------------------------------------------

Atte.,
    `.trim().replace(/^\s+/gm, '');

    const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
};


export function PhiTable({ data }: PhiTableProps) {
  const sortedData = [...data].sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
          <History className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-xl font-semibold">No hay ensayos finalizados</h3>
          <p>Los ensayos completados aparecerán aquí.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Raya</TableHead>
            <TableHead>Horas</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((ensayo) => {
            return (
            <TableRow key={ensayo.id}>
              <TableCell className="font-medium max-w-xs truncate">{ensayo.producto}</TableCell>
              <TableCell>
                <Badge style={{ backgroundColor: getColorForRaya(ensayo.raya), color: (ensayo.raya.toLowerCase() === 'blanca' ? 'black' : 'white') }} className="border border-black/20">{ensayo.raya}</Badge>
              </TableCell>
              <TableCell>{ensayo.horas}</TableCell>
              <TableCell><FechaCell fechaISO={ensayo.fechaInicio} /></TableCell>
              <TableCell><FechaFinCell fechaInicioISO={ensayo.fechaInicio} horas={ensayo.horas} /></TableCell>
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
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleEmailClick(ensayo)}>
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Notificar liberación</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reenviar notificación</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}

const getColorForRaya = (raya: string) => {
    const colors: {[key: string]: string} = {
        'azul': '#3b82f6',
        'roja': '#ef4444',
        'verde': '#22c55e',
        'blanca': '#e5e5e5',
        'negra': '#171717',
    }
    return raya ? colors[raya.toLowerCase()] || '#6b7280' : '#6b7280';
}
