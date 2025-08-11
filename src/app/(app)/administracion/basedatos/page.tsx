
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Database, Download, FileJson, Server, AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function BaseDatosPage() {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
            title: `Acción: ${action}`,
            description: "Esta funcionalidad se conectaría a los servicios de backend en un entorno de producción.",
        });
    };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Administración de Base de Datos</CardTitle>
                <CardDescription>Herramientas para gestionar, respaldar y mantener la base de datos del sistema.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatCard title="Colecciones" value="12" icon={Database} />
                    <StatCard title="Documentos Totales" value="15,482" icon={FileJson} />
                    <StatCard title="Tamaño Estimado" value="2.1 GB" icon={Server} />
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Entorno de Prototipo</AlertTitle>
                  <AlertDescription>
                    Actualmente, la aplicación utiliza datos de demostración locales. En un entorno de producción, esta sección se conectaría a una base de datos real (ej. Firestore o SQL Server) para realizar operaciones en vivo.
                  </AlertDescription>
                </Alert>

            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Operaciones de Datos</CardTitle>
                <CardDescription>Realice copias de seguridad y exporte los datos de sus colecciones.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Copia de Seguridad</CardTitle>
                        <CardDescription>Genere una copia de seguridad completa de la base de datos en un formato seguro.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => handleAction('Copia de Seguridad')}>
                            <Download className="mr-2 h-4 w-4"/>
                            Realizar Copia de Seguridad
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Exportar a JSON</CardTitle>
                        <CardDescription>Exporte todas las colecciones de la base de datos a archivos JSON individuales.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => handleAction('Exportar a JSON')} variant="secondary">
                            <FileJson className="mr-2 h-4 w-4"/>
                            Exportar Datos
                        </Button>
                    </CardFooter>
                </Card>
            </CardContent>
        </Card>
    </div>
  );
}
