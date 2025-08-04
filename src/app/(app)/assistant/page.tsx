
import { AssistantForm } from '@/components/assistant/assistant-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asistente IA',
};

export default function AssistantPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-10">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Asistente de Código IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Este es tu asistente IA para el desarrollo de la aplicación. No solo puedo generar código o darte sugerencias, sino que también puedo realizar cambios directamente en los archivos del proyecto. Describe tu solicitud y yo me encargaré de aplicar las modificaciones necesarias.
        </p>
      </div>
      <AssistantForm />
    </div>
  );
}
