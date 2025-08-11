
"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AlertaConfig } from "@/services/data-service";
import { Badge } from "../ui/badge";

interface ConfiguracionAlertasProps {
    initialConfigs: AlertaConfig[];
}

export function ConfiguracionAlertas({ initialConfigs }: ConfiguracionAlertasProps) {
    const [configs, setConfigs] = React.useState(initialConfigs);
    const { toast } = useToast();

    const handleToggle = (id: string, channel: 'email' | 'sms') => {
        setConfigs(prev => prev.map(c => 
            c.id === id ? { ...c, [channel]: { ...c[channel], activa: !c[channel].activa } } : c
        ));
        toast({
            title: "Configuración Guardada",
            description: "El estado de la notificación ha sido actualizado.",
        });
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">Tipo de Alerta</TableHead>
                        <TableHead>Notificar por Email</TableHead>
                        <TableHead>Notificar por SMS</TableHead>
                        <TableHead className="text-right">Destinatarios</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {configs.map((config) => (
                        <TableRow key={config.id}>
                            <TableCell>
                                <div className="font-medium">{config.nombre}</div>
                                <div className="text-sm text-muted-foreground">{config.descripcion}</div>
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={config.email.activa}
                                    onCheckedChange={() => handleToggle(config.id, 'email')}
                                />
                            </TableCell>
                            <TableCell>
                                <Switch
                                    checked={config.sms.activa}
                                    onCheckedChange={() => handleToggle(config.id, 'sms')}
                                />
                            </TableCell>
                            <TableCell className="text-right">
                                {config.roles.map(role => <Badge key={role} variant="secondary" className="mr-1">{role}</Badge>)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
