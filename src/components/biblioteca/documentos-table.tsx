
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Library, ServerCrash, Eye, MoreHorizontal, CheckCircle, Clock, Trash2, PenSquare } from "lucide-react";
import type { KnowledgeBaseFile } from "@/services/server-data-service";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface DocumentosTableProps {
    files: KnowledgeBaseFile[];
}

const getStatusVariant = (status: KnowledgeBaseFile['status']) => {
    switch (status) {
        case "Aprobado": return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
        case "En Revisión": return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
        default: return "bg-secondary";
    }
}


export function DocumentosTable({ files: initialFiles }: DocumentosTableProps) {
  const { toast } = useToast();
  const [files, setFiles] = React.useState(initialFiles);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  const handleApprove = (fileName: string) => {
    setFiles(files.map(file => {
        if (file.name === fileName) {
            toast({
                title: "Documento Aprobado y Firmado",
                description: `${fileName} ha sido aprobado y su versión ha sido actualizada.`,
            });
            return {
                ...file,
                status: 'Aprobado',
                version: (file.version || 1) + 1,
                approvedBy: 'Victor Lutz', // Mock user
                approvedAt: new Date().toLocaleDateString('es-CL'),
            };
        }
        return file;
    }));
  }

  const handleDelete = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
     toast({
        variant: "destructive",
        title: "Documento Eliminado",
        description: `${fileName} ha sido eliminado de la biblioteca.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <Library className="h-8 w-8 text-primary"/>
            <div>
                <CardTitle>Gestor Documental</CardTitle>
                <CardDescription>
                    Repositorio central para procedimientos, manuales y normativas. Los documentos aquí son la base de conocimiento para el Asistente de IA.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre del Archivo</TableHead>
                    <TableHead className="text-center">Versión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Aprobado por</TableHead>
                    <TableHead>Fecha Aprobación</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {files.length > 0 ? files.map((file) => (
                <TableRow key={file.name}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <FileText className="h-4 w-4 text-muted-foreground" />
                           <span>{file.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="outline">{file.version || 1}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge className={cn("font-normal border-transparent", getStatusVariant(file.status))}>
                            {file.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{file.approvedBy || '---'}</TableCell>
                    <TableCell>{file.approvedAt || '---'}</TableCell>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/data/${file.name}`} target="_blank"><Eye className="mr-2 h-4 w-4" />Ver Documento</Link>
                                    </DropdownMenuItem>
                                     <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <PenSquare className="mr-2 h-4 w-4" />Aprobar y Firmar Digitalmente
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
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
                                    <AlertDialogTitle>¿Está seguro que desea firmar y aprobar este documento?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción es irreversible y quedará registrada en el historial de auditoría. El documento '{file.name}' será marcado como 'Aprobado' y su número de versión se incrementará.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleApprove(file.name)}>
                                        Sí, firmar y aprobar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                </TableRow>
                )) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                         <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ServerCrash className="h-8 w-8"/>
                            <span className="font-semibold">La biblioteca está vacía.</span>
                            <span>Cargue documentos para empezar a gestionar la base de conocimiento.</span>
                         </div>
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
