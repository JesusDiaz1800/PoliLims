
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Cog, History, FileText } from "lucide-react";
import { ConfiguracionAlertas } from "@/components/notificaciones/configuracion-alertas";
import { HistorialNotificaciones } from "@/components/notificaciones/historial-notificaciones";
import { PlantillasNotificaciones } from "@/components/notificaciones/plantillas-notificaciones";
import { mockAlertConfigs, mockNotificationHistory, mockAlertTemplates } from "@/services/data-service";

export default function NotificacionesPage() {

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Bell className="h-8 w-8 text-primary"/>
                    <div>
                        <CardTitle>Gestión de Notificaciones</CardTitle>
                        <CardDescription>
                            Configure alertas, revise el historial y administre las plantillas de mensajes del sistema.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="configuracion">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="configuracion">
                            <Cog className="mr-2 h-4 w-4" />
                            Configuración de Alertas
                        </TabsTrigger>
                        <TabsTrigger value="historial">
                            <History className="mr-2 h-4 w-4" />
                            Historial de Envíos
                        </TabsTrigger>
                        <TabsTrigger value="plantillas">
                            <FileText className="mr-2 h-4 w-4" />
                            Plantillas de Mensajes
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="configuracion" className="pt-6">
                        <ConfiguracionAlertas initialConfigs={mockAlertConfigs} />
                    </TabsContent>
                    <TabsContent value="historial" className="pt-6">
                        <HistorialNotificaciones initialHistory={mockNotificationHistory} />
                    </TabsContent>
                    <TabsContent value="plantillas" className="pt-6">
                        <PlantillasNotificaciones initialTemplates={mockAlertTemplates} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
