
import { TroubleshootingForm } from '@/components/troubleshooting/troubleshooting-form';
import type { Metadata } from 'next';
import { Unplug } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solución de Problemas',
};

export default function TroubleshootingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-10">
        <div className="inline-block p-3 bg-primary/10 rounded-lg">
            <Unplug className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Asistente para Solución de Problemas
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ¿Tienes un problema en el laboratorio? Describe el error y las circunstancias, y el sistema te guiará hacia la solución.
        </p>
      </div>
      <TroubleshootingForm />
    </div>
  );
}
