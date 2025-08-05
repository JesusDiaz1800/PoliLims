
import { AssistantForm } from '@/components/assistant/assistant-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asistente de Código',
};

export default function AssistantPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-10">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Asistente de Código
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Esta es una herramienta de asistencia para el desarrollo. Describe tu solicitud y el sistema se encargará de aplicar las modificaciones necesarias en el código del proyecto.
        </p>
      </div>
      <AssistantForm />
    </div>
  );
}
