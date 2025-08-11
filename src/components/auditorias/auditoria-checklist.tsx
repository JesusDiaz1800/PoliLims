
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Auditoria } from "@/context/data-context";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { iso17025Checklist } from "@/lib/iso17025-checklist";

interface AuditoriaChecklistProps {
  auditoria: Auditoria;
}

const statusOptions = [
    { value: "na", label: "No Aplica" },
    { value: "ok_doc", label: "Cumple y Documentado" },
    { value: "ok_no_doc", label: "Cumple, no Documentado" },
    { value: "pending", label: "Se Cumplirá Posteriormente" },
    { value: "fail", label: "No se Cumple" },
    { value: "no_evidence", label: "Sin Evidencia" },
];

export function AuditoriaChecklist({ auditoria }: AuditoriaChecklistProps) {
    const [checklistData, setChecklistData] = React.useState(iso17025Checklist);
    
    // In a real app, you would save this state back to the database.
    const handleStatusChange = (index: number, status: string) => {
        const newData = [...checklistData];
        newData[index].estado = status;
        setChecklistData(newData);
    };

    const handleCommentsChange = (index: number, comments: string) => {
        const newData = [...checklistData];
        newData[index].comentarios = comments;
        setChecklistData(newData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Checklist de Ejecución: ISO/IEC 17025</CardTitle>
                <CardDescription>
                    Utilice esta guía para realizar la auditoría, registrar el estado de cada requisito y añadir comentarios.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[55vh]">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                            <TableHead className="w-[5%]">Cláusula</TableHead>
                            <TableHead className="w-[25%]">Requisito de la Norma</TableHead>
                            <TableHead className="w-[25%]">Documento de Evidencia</TableHead>
                            <TableHead className="w-[20%]">Estado del Documento</TableHead>
                            <TableHead className="w-[25%]">Comentarios / Recomendaciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {checklistData.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.isHeader && (
                                     <TableRow className="bg-muted/60 hover:bg-muted/60">
                                        <TableCell colSpan={5} className="font-bold text-primary">
                                            {item.clausula}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!item.isHeader && (
                                    <TableRow>
                                        <TableCell className="font-medium align-top">{item.clausula}</TableCell>
                                        <TableCell className="text-xs align-top">{item.requisito}</TableCell>
                                        <TableCell className="text-xs font-mono align-top">{item.evidencia.split(', ').map(e => <div key={e}>{e}</div>)}</TableCell>
                                        <TableCell className="align-top">
                                            <Select value={item.estado} onValueChange={(value) => handleStatusChange(index, value)}>
                                                <SelectTrigger className="text-xs h-8">
                                                    <SelectValue placeholder="Seleccione estado..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map(opt => (
                                                        <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Textarea
                                                value={item.comentarios}
                                                onChange={(e) => handleCommentsChange(index, e.target.value)}
                                                placeholder="Añadir comentarios..."
                                                className="text-xs min-h-[60px]"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

