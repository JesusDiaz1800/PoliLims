
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, CheckSquare, FileText, Search, Wrench } from "lucide-react";
import type { ControlEvento, Equipo } from "@/context/data-context";

interface ControlEventosTableProps {
  controles: ControlEvento[];
  equipos: Equipo[];
  isDialogView?: boolean;
}

const EventoIcon = ({ tipo }: { tipo: ControlEvento['tipo']}) => {
    switch (tipo) {
        case 'Calibración': return <Calendar className="h-4 w-4 text-blue-500" />;
        case 'Verificación': return <CheckSquare className="h-4 w-4 text-green-500" />;
        case 'Mantenimiento Preventivo': return <Wrench className="h-4 w-4 text-yellow-500" />;
        case 'Mantenimiento Correctivo': return <Wrench className="h-4 w-4 text-red-500" />;
        default: return <FileText className="h-4 w-4" />;
    }
}

export function ControlEventosTable({ controles, equipos, isDialogView = false }: ControlEventosTableProps) {
  const [filters, setFilters] = React.useState({
    equipoId: 'all',
    tipo: 'all',
    responsable: '',
  });

  const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredControles = controles.filter(control => {
    const matchEquipo = filters.equipoId === 'all' || control.equipoId === filters.equipoId;
    const matchTipo = filters.tipo === 'all' || control.tipo === filters.tipo;
    const matchResponsable = !filters.responsable || control.responsable.toLowerCase().includes(filters.responsable.toLowerCase());
    return matchEquipo && matchTipo && matchResponsable;
  });

  const getEquipoNombre = (id: string) => equipos.find(e => e.id === id)?.nombre || id;

  const tipoOptions = ['Calibración', 'Verificación', 'Mantenimiento Preventivo', 'Mantenimiento Correctivo'];
  const equipoOptions = [{ value: 'all', label: 'Todos los Equipos' }, ...equipos.map(e => ({ value: e.id, label: `${e.nombre} (${e.id})`}))];

  return (
    <Card>
      {!isDialogView && (
        <CardHeader>
            <CardTitle>Historial de Control de Equipos</CardTitle>
            <CardDescription>Visualice y filtre todos los eventos de mantenimiento y calibración registrados.</CardDescription>
        </CardHeader>
      )}
      <CardContent className={isDialogView ? "p-0" : ""}>
        {!isDialogView && (
            <div className="flex flex-col md:flex-row items-center justify-start gap-2 w-full mb-4">
                <Select value={filters.equipoId} onValueChange={handleFilterChange('equipoId')}>
                    <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Filtrar por equipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {equipoOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filters.tipo} onValueChange={handleFilterChange('tipo')}>
                    <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Filtrar por tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los Tipos</SelectItem>
                        {tipoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                </Select>
                <div className="relative w-full md:w-auto flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por responsable..."
                        className="pl-9 w-full"
                        value={filters.responsable}
                        onChange={(e) => handleFilterChange('responsable')(e.target.value)}
                    />
                </div>
            </div>
        )}
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    {!isDialogView && <TableHead>Equipo</TableHead>}
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Observaciones</TableHead>
                    <TableHead>Próximo Control</TableHead>
                    <TableHead>Certificado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredControles.length > 0 ? filteredControles.map(control => (
                    <TableRow key={control.id}>
                        {!isDialogView && <TableCell className="font-medium">{getEquipoNombre(control.equipoId)}</TableCell>}
                        <TableCell><div className="flex items-center gap-2"><EventoIcon tipo={control.tipo} /><span>{control.tipo}</span></div></TableCell>
                        <TableCell>{control.fecha}</TableCell>
                        <TableCell>{control.responsable}</TableCell>
                        <TableCell className="max-w-xs truncate">{control.observaciones || "N/A"}</TableCell>
                        <TableCell>{control.proximo_control || 'N/A'}</TableCell>
                        <TableCell>
                        {control.certificadoUrl ? (<Button variant="link" size="sm" className="p-0 h-auto" asChild><a href={control.certificadoUrl} target="_blank" rel="noopener noreferrer">Ver</a></Button>) : "N/A"}
                        </TableCell>
                    </TableRow>
                    )) : (
                    <TableRow><TableCell colSpan={isDialogView ? 6 : 7} className="h-24 text-center">No se encontraron eventos.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
