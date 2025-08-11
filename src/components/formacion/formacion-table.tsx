
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
} from "@/components/ui/alert-dialog";
import { Search, FilePlus, Edit, MoreHorizontal, Trash2, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Formacion } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { deleteFormacionAction } from "@/app/(app)/administracion/formacion/actions";


interface FormacionTableProps {
  data: Formacion[];
  onAddNew: () => void;
  onEdit: (record: Formacion) => void;
}

function getStatusVariant(status: Formacion["resultado"]) {
  switch (status) {
    case "Aprobado":
    case "Completado":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "Pendiente":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Reprobado":
      return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
    default:
      return "bg-secondary";
  }
}

const FormacionTableInternal = ({ data, onAddNew, onEdit }: FormacionTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  const filteredData = React.useMemo(() => 
    data.filter(
      (item) =>
        item.empleadoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nombre_actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);
  
  const handleDelete = async (id: string) => {
    const result = await deleteFormacionAction(id);
    if (result.success) {
        toast({
            title: "Registro Eliminado",
            description: "La actividad de formación ha sido eliminada.",
        });
    } else {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el registro.",
        });
        console.error("Failed to delete training record", result.message);
    }
  };
  
  return (
    <Card>
    <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
            <CardTitle>Historial de Formación y Competencia</CardTitle>
            <CardDescription>
            Registre y administre las actividades de formación y competencia del personal.
            </CardDescription>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Buscar por empleado, curso..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
            <FilePlus className="mr-2 h-4 w-4" />
            Registrar Actividad
            </Button>
        </div>
        </div>
    </CardHeader>
    <CardContent>
        <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Tipo de Actividad</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {filteredData.map((item) => {
            return (
            <TableRow key={item.id}>
                <TableCell className="font-medium">{item.empleadoNombre}</TableCell>
                <TableCell><Badge variant="outline">{item.tipo}</Badge></TableCell>
                <TableCell>{item.nombre_actividad}</TableCell>
                <TableCell>{format(parseISO(item.fecha), 'dd-MM-yyyy')}</TableCell>
                <TableCell>
                <Badge className={cn("border-transparent font-normal", getStatusVariant(item.resultado))}>
                    {item.resultado}
                </Badge>
                </TableCell>
                <TableCell>
                    {item.fecha_vencimiento ? format(parseISO(item.fecha_vencimiento), 'dd-MM-yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                    <AlertDialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" /><span className="sr-only">Acciones</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => onEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />Eliminar
                                </DropdownMenuItem>
                             </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el registro de formación para <span className="font-bold">{item.empleadoNombre}</span> sobre la actividad <span className="font-bold">{item.nombre_actividad}</span>.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar registro
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
            </TableRow>
            )})}
        </TableBody>
        </Table>
        {filteredData.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
            <GraduationCap className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron registros</h3>
            <p>Intente ajustar su búsqueda o registre una nueva actividad.</p>
        </div>
        )}
    </CardContent>
    </Card>
  );
};

export const FormacionTable = React.memo(FormacionTableInternal);
