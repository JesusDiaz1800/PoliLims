
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Configuración',
// };

export default function ConfiguracionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de la Aplicación</CardTitle>
        <CardDescription>Personalice la apariencia y el idioma de la aplicación según sus preferencias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Apariencia</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                    <Label htmlFor="theme">Tema</Label>
                    <p className="text-sm text-muted-foreground">Seleccione un tema para la interfaz.</p>
                </div>
                <ThemeToggle />
            </div>
        </div>
         <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Idioma</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                    <Label htmlFor="language">Idioma de la Interfaz</Label>
                    <p className="text-sm text-muted-foreground">Elija el idioma para los textos de la aplicación.</p>
                </div>
                <Select defaultValue="es">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccione idioma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en" disabled>English (Próximamente)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
