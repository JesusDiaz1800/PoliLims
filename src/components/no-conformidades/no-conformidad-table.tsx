
"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, FilePlus, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData, type NoConformidad } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";

interface NoConformidadTableProps {
  incidencias: NoConformidad[];
  onAddNew: () => void;
  onEdit: (incidencia: NoConformidad) => void;
}

function getSeverityVariant(severity: NoConformidad["severidad"]) {
    switch(severity) {
        case 'Crítica': return 'bg-red-600 hover:bg-red-700 text-white';
        case 'Alta': return 'bg-orange-500 hover:bg-orange-600 text-white';
        case 'Media': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
        case 'Baja': return 'bg-blue-500 hover:bg-blue-600 text-white';
        default: return 'bg-secondary';
    }
}

function getStatusVariant(status: NoConformidad["estado"]) {
  switch (status) {
    case "Abierta": return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "En Investigación": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Resuelta": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "Cerrada": return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    default: return "bg-secondary";
  }
}

export function NoConformidadTable({ incidencias, onAddNew, onEdit }: NoConformidadTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { deleteIncidencia } = useDynamicData();
  const { toast } = useToast();

  const filteredIncidencias = React.useMemo(() => 
    incidencias.filter(
      (incidencia) =>
        incidencia.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incidencia.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incidencia.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    ), [incidencias, searchTerm]);
  
  const handleDelete = async (incidenciaId: string) => {
    try {
        await deleteIncidencia(incidenciaId);
        toast({
            title: "Incidencia Eliminada",
            description: "La no conformidad ha sido eliminada correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar la incidencia. Intente de nuevo.",
        });
        console.error("Failed to delete incidencia", error);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Gestión de No Conformidades</CardTitle>
            <CardDescription>
              Registre, controle y gestione todas las incidencias, reclamaciones y no conformidades del laboratorio.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, descripción..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Registrar Incidencia
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha Detección</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidencias.map((incidencia) => (
              <TableRow key={incidencia.id}>
                <TableCell className="font-mono">{incidencia.id}</TableCell>
                <TableCell>{incidencia.tipo}</TableCell>
                <TableCell>{incidencia.fecha_deteccion}</TableCell>
                <TableCell className="max-w-sm truncate">{incidencia.descripcion}</TableCell>
                <TableCell>
                  <Badge className={cn("border-transparent font-normal", getSeverityVariant(incidencia.severidad))}>
                    {incidencia.severidad}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("border-transparent font-normal", getStatusVariant(incidencia.estado))}>
                    {incidencia.estado}
                  </Badge>
                </TableCell>
                <TableCell>{incidencia.responsable}</TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => onEdit(incidencia)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar / Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                             </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                         <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la incidencia
                                  <span className="font-bold"> {incidencia.id}</span>.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(incidencia.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar incidencia
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredIncidencias.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron incidencias</h3>
            <p>Intente ajustar su búsqueda o registre una nueva no conformidad.</p>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
