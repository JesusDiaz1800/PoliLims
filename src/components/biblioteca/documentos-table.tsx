
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Library, ServerCrash } from "lucide-react";
import type { KnowledgeBaseFile } from "@/services/server-data-service";
import { Button } from "../ui/button";
import Link from "next/link";


interface DocumentosTableProps {
    files: KnowledgeBaseFile[];
}

export function DocumentosTable({ files }: DocumentosTableProps) {

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <Library className="h-8 w-8 text-primary"/>
            <div>
                <CardTitle>Biblioteca de Documentos</CardTitle>
                <CardDescription>
                    Esta es la base de conocimiento actual para el Asistente de Soporte. Los archivos listados aquí son consultados para responder preguntas.
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
                <TableHead>Tamaño</TableHead>
                <TableHead className="text-right">Acción</TableHead>
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
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                           <Link href={`/data/${file.name}`} target="_blank">Ver Archivo</Link>
                        </Button>
                    </TableCell>
                </TableRow>
                )) : (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                         <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <ServerCrash className="h-8 w-8"/>
                            <span className="font-semibold">La base de conocimiento está vacía.</span>
                            <span>Cargue documentos para que el Asistente de Soporte pueda consultarlos.</span>
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
