import { TroubleshootingForm } from '@/components/troubleshooting/troubleshooting-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico con IA',
};

export default function TroubleshootingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-10">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Diagnóstico Asistido por IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analice mensajes de error y patrones de uso inusuales para identificar problemas potenciales de forma proactiva y recibir documentación y soluciones relevantes.
        </p>
      </div>
      <TroubleshootingForm />
    </div>
  );
}
