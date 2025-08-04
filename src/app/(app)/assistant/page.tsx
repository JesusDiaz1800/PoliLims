
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
          Utilice esta herramienta para generar código, solucionar errores o pedir sugerencias para mejorar la aplicación. Describa su solicitud y la IA le proporcionará una respuesta.
        </p>
      </div>
      <AssistantForm />
    </div>
  );
}
