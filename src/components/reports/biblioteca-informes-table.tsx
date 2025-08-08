
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
import { Button } from "@/components/ui/button";
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
import { Search, MoreHorizontal, Trash2, Library, Eye, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData, type GeneratedReport } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";

interface BibliotecaInformesTableProps {
  informes: GeneratedReport[];
}

const BibliotecaInformesTableInternal = ({ informes }: BibliotecaInformesTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("Todos");
  const { deleteGeneratedReport } = useDynamicData();
  const { toast } = useToast();

  const tiposDeInforme = ["Todos", ...Array.from(new Set(informes.map(i => i.tipo)))];

  const filteredInformes = React.useMemo(() => 
    informes.filter(
      (informe) =>
        (filterType === "Todos" || informe.tipo === filterType) &&
        (informe.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [informes, searchTerm, filterType]);
  
  const handleDelete = async (id: string) => {
    try {
        await deleteGeneratedReport(id);
        toast({
            title: "Informe Eliminado",
            description: "El registro del informe ha sido eliminado de la biblioteca.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el registro del informe.",
        });
        console.error("Failed to delete report record", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Biblioteca de Informes</CardTitle>
            <CardDescription>
              Busque y gestione todos los informes generados por el sistema.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, producto, lote..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <FileSearch className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    {tiposDeInforme.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Nombre del Informe</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInformes.length > 0 ? filteredInformes.map((informe) => (
                    <TableRow key={informe.id}>
                        <TableCell className="font-medium">{informe.nombre}</TableCell>
                        <TableCell><Badge variant="outline">{informe.tipo}</Badge></TableCell>
                        <TableCell>{informe.fecha_creacion}</TableCell>
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
                                        <DropdownMenuItem onSelect={() => alert('Función de vista previa no implementada.')}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver/Imprimir
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
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el registro del informe <span className="font-bold">{informe.nombre}</span>.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(informe.id)} className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")}>
                                            Sí, eliminar registro
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No se encontraron informes.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export const BibliotecaInformesTable = React.memo(BibliotecaInformesTableInternal);
