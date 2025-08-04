
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Library, FileText, BookOpen } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Biblioteca de Documentos',
};

export default function BibliotecaPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biblioteca de Documentos</CardTitle>
        <CardDescription>Repositorio central para manuales, procedimientos y otros documentos importantes.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="flex items-center justify-center gap-8 mb-8">
            <FileText className="w-16 h-16 text-muted-foreground/50" />
            <Library className="w-24 h-24 text-primary" />
            <BookOpen className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold font-headline">Biblioteca de Documentos Próximamente</h3>
        <p className="text-muted-foreground mt-2 max-w-xl">
            Esta sección contendrá una tabla para buscar y acceder a todos los documentos del laboratorio. 
            Actualmente, puede vincular documentos a equipos específicos editando un equipo y pegando la URL del documento.
        </p>
      </CardContent>
    </Card>
  );
}
