import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flujos de Trabajo',
};

export default function WorkflowsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Flujos de Trabajo</CardTitle>
        <CardDescription>Visualización interactiva de flujos de trabajo para seguir muestras y procesos.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <GitBranch className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Visualización de Flujos de Trabajo Próximamente</h3>
        <p className="text-muted-foreground mt-2">Esta sección proporcionará una representación gráfica de sus procesos de laboratorio.</p>
      </CardContent>
    </Card>
  );
}
