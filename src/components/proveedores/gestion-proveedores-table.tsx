

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
import { Search, FilePlus, Edit, MoreHorizontal, Trash2, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicData, type Proveedor } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";


interface GestionProveedoresTableProps {
  proveedores: Proveedor[];
  onAddNew: () => void;
  onEdit: (proveedor: Proveedor) => void;
}

function getStatusVariant(status: Proveedor["estado"]) {
  switch (status) {
    case "Activo":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "En evaluación":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Inactivo":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    default:
      return "bg-secondary";
  }
}

const GestionProveedoresTableInternal = ({ proveedores, onAddNew, onEdit }: GestionProveedoresTableProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { deleteProveedor } = useDynamicData();
  const { toast } = useToast();

  const filteredProveedores = React.useMemo(() => 
    proveedores.filter(
      (proveedor) =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    ), [proveedores, searchTerm]);
  
  const handleDelete = async (proveedorId: string) => {
    try {
        await deleteProveedor(proveedorId);
        toast({
            title: "Proveedor Eliminado",
            description: "El proveedor ha sido eliminado correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar el proveedor. Intente de nuevo.",
        });
        console.error("Failed to delete proveedor", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle>Gestión de Proveedores</CardTitle>
            <CardDescription>
              Administre la lista de proveedores de servicios y materiales del laboratorio.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o tipo..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Registrar Proveedor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Proveedor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProveedores.map((proveedor) => (
              <TableRow key={proveedor.id}>
                <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.tipo}</TableCell>
                <TableCell>{proveedor.contacto_nombre || 'N/A'}</TableCell>
                <TableCell>{proveedor.contacto_email || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={cn("border-transparent font-normal", getStatusVariant(proveedor.estado))}>
                    {proveedor.estado}
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
                            <DropdownMenuItem onSelect={() => onEdit(proveedor)}>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente al proveedor <span className="font-bold">{proveedor.nombre}</span>.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(proveedor.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar proveedor
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredProveedores.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Truck className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron proveedores</h3>
            <p>Intente ajustar su búsqueda o registre un nuevo proveedor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const GestionProveedoresTable = React.memo(GestionProveedoresTableInternal);
