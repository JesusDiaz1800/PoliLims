
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Mail, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import type { Notificacion } from "@/services/data-service";

interface HistorialNotificacionesProps {
    initialHistory: Notificacion[];
}

const statusMap: { [key in Notificacion['estado']]: { icon: React.ElementType, color: string, label: string } } = {
    'Enviado': { icon: CheckCircle, color: 'text-green-500', label: 'Enviado' },
    'Fallido': { icon: XCircle, color: 'text-red-500', label: 'Fallido' },
    'Pendiente': { icon: Clock, color: 'text-yellow-500', label: 'Pendiente' },
};

const channelMap = {
    'Email': { icon: Mail },
    'SMS': { icon: MessageSquare },
};

export function HistorialNotificaciones({ initialHistory }: HistorialNotificacionesProps) {
    const [history, setHistory] = React.useState(initialHistory);
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredHistory = history.filter(item => 
        item.destinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.asunto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por destinatario o asunto..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Canal</TableHead>
                            <TableHead>Destinatario</TableHead>
                            <TableHead>Asunto</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.map((item) => {
                             const StatusIcon = statusMap[item.estado].icon;
                             const ChannelIcon = channelMap[item.canal].icon;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{format(parseISO(item.fecha), 'dd-MM-yyyy HH:mm')}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                                            <span>{item.canal}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.destinatario}</TableCell>
                                    <TableCell className="font-medium">{item.asunto}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("font-normal gap-1.5", statusMap[item.estado].color)}>
                                            <StatusIcon className="h-3.5 w-3.5" />
                                            {statusMap[item.estado].label}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {filteredHistory.length === 0 && (
                     <div className="text-center p-8 text-muted-foreground">
                        <Search className="mx-auto h-10 w-10 mb-2"/>
                        <p>No se encontraron notificaciones.</p>
                     </div>
                )}
            </div>
        </div>
    );
}
