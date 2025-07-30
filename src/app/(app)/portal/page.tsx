import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portal de Clientes',
};

export default function ClientPortalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal de Clientes</CardTitle>
        <CardDescription>Un portal dedicado para que los clientes envíen muestras.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold font-headline">Portal de Clientes Próximamente</h3>
        <p className="text-muted-foreground mt-2">Una interfaz web personalizada para que los clientes envíen muestras de forma independiente.</p>
      </CardContent>
    </Card>
  );
}
