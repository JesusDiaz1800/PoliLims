
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
import { useDynamicData, type Importacion } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface ImportacionesTableProps {
  importaciones: Importacion[];
  onAddNew: () => void;
  onEdit: (importacion: Importacion) => void;
}

function getStatusVariant(status?: 'CADUCADO' | 'VIGENTE' | 'EN TRANSITO') {
  switch (status) {
    case "VIGENTE":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "EN TRANSITO":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "CADUCADO":
      return "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30";
    default:
      return "bg-secondary";
  }
}

export function ImportacionesTable({ importaciones, onAddNew, onEdit }: ImportacionesTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { deleteImportacion } = useDynamicData();
  const { toast } = useToast();

  const filteredImportaciones = importaciones.filter(
    (item) =>
      item.bl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.proveedor && item.proveedor.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDelete = async (id: string) => {
    try {
        await deleteImportacion(id);
        toast({
            title: "Importación Eliminada",
            description: "El registro de importación ha sido eliminado correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el registro. Intente de nuevo.",
        });
        console.error("Failed to delete import record", error);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Control de Importaciones</CardTitle>
            <CardDescription>
              Seguimiento de la materia prima desde el embarque hasta su liberación en laboratorio.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por BL, Proveedor..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Registrar Importación
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>BL N°</TableHead>
              <TableHead>Fecha Embarque</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>N° Operación</TableHead>
              <TableHead>DI</TableHead>
              <TableHead>Fecha Entrega Calidad</TableHead>
              <TableHead>Fecha Liberación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredImportaciones.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono font-semibold">{item.bl}</TableCell>
                <TableCell>{item.fecha_embarque || 'N/A'}</TableCell>
                <TableCell>{item.proveedor || 'N/A'}</TableCell>
                <TableCell>{item.operacion || 'N/A'}</TableCell>
                <TableCell>{item.di || 'N/A'}</TableCell>
                <TableCell>{item.fecha_entrega_calidad || 'N/A'}</TableCell>
                <TableCell>{item.fecha_liberacion || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={cn("border-transparent font-normal", getStatusVariant(item.estado))}>
                    {item.estado || "N/A"}
                  </Badge>
                </TableCell>
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
                            <DropdownMenuItem onSelect={() => onEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el registro de importación con BL:
                                  <span className="font-bold"> {item.bl}</span>.
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
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {filteredImportaciones.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron registros</h3>
            <p>Intente ajustar su búsqueda o registre una nueva importación.</p>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
