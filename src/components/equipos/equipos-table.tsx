
"use client";

import * as React from "react";
import Image from "next/image";
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
import { Search, FilePlus, Edit, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData, type Equipo } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { EquipoDetailsDialog } from "./equipo-details-dialog";

interface EquiposTableProps {
  equipos: Equipo[];
  onAddNew: () => void;
  onEdit: (equipo: Equipo) => void;
}

function getStatusVariant(status: Equipo["estado"]) {
  switch (status) {
    case "Activo":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "En Mantenimiento":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Inactivo":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    case "Requiere Calibración":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
    default:
      return "bg-secondary";
  }
}

export function EquiposTable({ equipos, onAddNew, onEdit }: EquiposTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { deleteEquipo } = useDynamicData();
  const { toast } = useToast();
  const [selectedEquipoDetails, setSelectedEquipoDetails] = React.useState<Equipo | null>(null);

  const filteredEquipos = equipos.filter(
    (equipo) =>
      equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (equipo.marca && equipo.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (equipo.modelo && equipo.modelo.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDelete = async (equipoId: string) => {
    try {
        await deleteEquipo(equipoId);
        toast({
            title: "Equipo Eliminado",
            description: "El equipo ha sido eliminado correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el equipo. Intente de nuevo.",
        });
        console.error("Failed to delete equipo", error);
    }
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Inventario de Equipos</CardTitle>
            <CardDescription>
              Visualice, registre y administre todos los equipos del
              laboratorio.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ID, marca..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Registrar Nuevo Equipo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead>ID Activo</TableHead>
              <TableHead>Nombre del Equipo</TableHead>
              <TableHead>Marca / Modelo</TableHead>
              <TableHead>Próxima Calibración</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipos.map((equipo) => (
              <TableRow key={equipo.id}>
                <TableCell>
                  <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                    {equipo.fotoUrl ? (
                      <Image src={equipo.fotoUrl} alt={equipo.nombre} width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin foto</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{equipo.id}</TableCell>
                <TableCell className="font-medium">{equipo.nombre}</TableCell>
                <TableCell>
                    <div>{equipo.marca}</div>
                    <div className="text-xs text-muted-foreground">{equipo.modelo}</div>
                </TableCell>
                <TableCell>{equipo.proxima_calibracion}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-transparent font-normal",
                      getStatusVariant(equipo.estado)
                    )}
                  >
                    {equipo.estado}
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
                            <DropdownMenuItem onSelect={() => setSelectedEquipoDetails(equipo)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onEdit(equipo)}>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente el equipo
                                  <span className="font-bold"> {equipo.nombre} ({equipo.id})</span> de los servidores.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(equipo.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar equipo
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredEquipos.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron equipos</h3>
            <p>Intente ajustar su búsqueda o registre un nuevo equipo.</p>
          </div>
        )}
      </CardContent>
    </Card>
    {selectedEquipoDetails && (
      <EquipoDetailsDialog
        equipo={selectedEquipoDetails}
        isOpen={!!selectedEquipoDetails}
        onClose={() => setSelectedEquipoDetails(null)}
        onEdit={() => {
            onEdit(selectedEquipoDetails);
            setSelectedEquipoDetails(null);
        }}
      />
    )}
    </>
  );
}
