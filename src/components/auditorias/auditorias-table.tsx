
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
import { Search, FilePlus, Edit, MoreHorizontal, Trash2, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Auditoria } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { useFilters } from "@/context/filter-context";

interface AuditoriasTableProps {
  auditorias: Auditoria[];
  onAddNew: () => void;
  onEdit: (auditoria: Auditoria) => void;
  onDelete: (id: string) => Promise<void>;
}

/**
 * @function getStatusVariant
 * @description Returns a Tailwind CSS class string for styling a badge based on the audit status.
 * @param {Auditoria["estado"]} status - The status of the audit.
 * @returns {string} The CSS class for the badge.
 */
function getStatusVariant(status: Auditoria["estado"]) {
  switch (status) {
    case "Planificada":
      return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
    case "En Curso":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Finalizada":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "Cancelada":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    default:
      return "bg-secondary";
  }
}

/**
 * @component AuditoriasTableInternal
 * @description Internal component for displaying a table of audits. It includes filtering,
 * and actions like editing and deleting audits. It's memoized for performance.
 * @param {AuditoriasTableProps} props - The props for the component.
 */
const AuditoriasTableInternal = ({ auditorias, onAddNew, onEdit, onDelete }: AuditoriasTableProps) => {
  const { toast } = useToast();
  const { filteredData: filteredAuditorias, searchTerm, setSearchTerm } = useFilters(auditorias, ['id', 'tipo', 'auditor_lider', 'alcance']);
  
  /**
   * @function handleDelete
   * @description Handles the deletion of an audit by calling the server action
   * and displaying a toast notification with the result.
   * @param {string} auditoriaId - The ID of the audit to delete.
   */
  const handleDelete = async (auditoriaId: string) => {
    try {
        await onDelete(auditoriaId);
        toast({
            title: "Auditoría Eliminada",
            description: "La auditoría ha sido eliminada correctamente.",
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al Eliminar",
            description: "No se pudo eliminar la auditoría. Intente de nuevo.",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="font-headline">Plan de Auditorías</CardTitle>
            <CardDescription>
              Gestione y planifique las auditorías internas y externas del sistema de calidad.
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, tipo, líder..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <FilePlus className="mr-2 h-4 w-4" />
              Planificar Auditoría
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Auditoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Fin</TableHead>
              <TableHead>Auditor Líder</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAuditorias.map((auditoria) => (
              <TableRow key={auditoria.id}>
                <TableCell className="font-mono">{auditoria.id}</TableCell>
                <TableCell>{auditoria.tipo}</TableCell>
                <TableCell>{format(parseISO(auditoria.fecha_inicio), 'dd-MM-yyyy')}</TableCell>
                <TableCell>{format(parseISO(auditoria.fecha_fin), 'dd-MM-yyyy')}</TableCell>
                <TableCell>{auditoria.auditor_lider}</TableCell>
                <TableCell>
                  <Badge className={cn("border-transparent font-normal", getStatusVariant(auditoria.estado))}>
                    {auditoria.estado}
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
                            <DropdownMenuItem onSelect={() => onEdit(auditoria)}>
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
                                  Esta acción no se puede deshacer. Esto eliminará permanentemente la auditoría <span className="font-bold">{auditoria.id}</span> y todos sus hallazgos asociados.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(auditoria.id)} className={cn(buttonVariants({variant: "destructive"}))}>
                                  Sí, eliminar auditoría
                              </AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredAuditorias.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardCheck className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold">No se encontraron auditorías</h3>
            <p>Intente ajustar su búsqueda o planifique una nueva auditoría.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AuditoriasTable = React.memo(AuditoriasTableInternal);
