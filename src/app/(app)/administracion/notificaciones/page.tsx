
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Cog, History } from "lucide-react";
import { ConfiguracionAlertas } from "@/components/notificaciones/configuracion-alertas";
import { HistorialNotificaciones } from "@/components/notificaciones/historial-notificaciones";
import { mockAlertConfigs, mockNotificationHistory } from "@/services/data-service";

export default function NotificacionesPage() {

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Bell className="h-8 w-8 text-primary"/>
                    <div>
                        <CardTitle>Gestión de Notificaciones</CardTitle>
                        <CardDescription>
                            Configure las alertas automáticas del sistema y revise el historial de notificaciones enviadas.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="configuracion">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="configuracion">
                            <Cog className="mr-2 h-4 w-4" />
                            Configuración de Alertas
                        </TabsTrigger>
                        <TabsTrigger value="historial">
                            <History className="mr-2 h-4 w-4" />
                            Historial de Envíos
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="configuracion" className="pt-4">
                        <ConfiguracionAlertas initialConfigs={mockAlertConfigs} />
                    </TabsContent>
                    <TabsContent value="historial" className="pt-4">
                        <HistorialNotificaciones initialHistory={mockNotificationHistory} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
