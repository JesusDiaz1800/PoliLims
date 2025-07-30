import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informes',
};

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generación de Informes</CardTitle>
        <CardDescription>Cree y gestione informes y Certificados de Análisis (CoA).</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Generador de Informes Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección permitirá la creación de informes y CoAs personalizables.</p>
      </CardContent>
    </Card>
  );
}
