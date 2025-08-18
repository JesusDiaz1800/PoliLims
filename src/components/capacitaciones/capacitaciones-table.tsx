
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
import { Search, FilePlus, Edit, MoreHorizontal, Trash2, GraduationCap, Users, FileText, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Capacitacion, User } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface CapacitacionesTableProps {
  data: Capacitacion[];
  onAddNew: () => void;
  onEdit: (record: Capacitacion) => void;
  onDelete: (id: string) => Promise<void>;
  onManageAsistencia: (record: Capacitacion) => void;
  onManageEvaluacion: (record: Capacitacion) => void;
  users: User[];
}

function getStatusVariant(status: Capacitacion["estado"]) {
  switch (status) {
    case "Planificada":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "Realizada":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "Cancelada":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    default:
      return "bg-secondary";
  }
}

const CapacitacionesTableInternal = ({ data, onAddNew, onEdit, onDelete, onManageAsistencia, onManageEvaluacion, users }: CapacitacionesTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  const filteredData = React.useMemo(() => 
    data.filter(
      (item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);
  
  const handleDelete = async (id: string) => {
    try {
        await onDelete(id);
        toast({
            title: "Capacitación Eliminada",
            description: "El registro de capacitación ha sido eliminado.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el registro.",
        });
        console.error("Failed to delete training record", error);
    }
  };
  
  return (
    <Card>
    <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
            <CardTitle>Plan de Capacitaciones</CardTitle>
            <CardDescription>
            Registre, administre y dé seguimiento a las capacitaciones del personal.
            </CardDescription>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Buscar por nombre, instructor..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
            <FilePlus className="mr-2 h-4 w-4" />
            Planificar Capacitación
            </Button>
        </div>
        </div>
    </CardHeader>
    <CardContent>
        <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Nombre Capacitación</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {filteredData.map((item) => {
              const asistentesPresentes = (item.asistentes || []).filter(a => a.asistio).length;
              return (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nombre}</TableCell>
                    <TableCell>{format(parseISO(item.fecha), 'dd-MM-yyyy')}</TableCell>
                    <TableCell>{item.instructor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{asistentesPresentes} / {(item.asistentes || []).length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border-transparent font-normal", getStatusVariant(item.estado))}>
                          {item.estado}
                      </Badge>
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
                                    <Edit className="mr-2 h-4 w-4" />Editar Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onManageAsistencia(item)}>
                                    <ClipboardCheck className="mr-2 h-4 w-4" />Gestionar Asistencia
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => onManageEvaluacion(item)}>
                                    <FileText className="mr-2 h-4 w-4" />Gestionar Evaluación
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente la capacitación <span className="font-bold">{item.nombre}</span> y todos sus registros asociados.
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
              )}
            )}
        </TableBody>
        </Table>
        {filteredData.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
            <GraduationCap className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron capacitaciones</h3>
            <p>Intente ajustar su búsqueda o registre una nueva actividad.</p>
        </div>
        )}
    </CardContent>
    </Card>
  );
};

export const CapacitacionesTable = React.memo(CapacitacionesTableInternal);
