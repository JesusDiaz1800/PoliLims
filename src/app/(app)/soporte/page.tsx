
import { DocumentAssistantForm } from '@/components/assistant/document-assistant-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asistente IA de Laboratorio',
};

export default function SoportePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-2 text-center mb-10">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Asistente IA de Laboratorio
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Haz una pregunta sobre los procedimientos o manuales del laboratorio. La IA buscará en los documentos internos para darte una respuesta precisa y basada en contexto. También puedes describir problemas o errores para obtener un diagnóstico.
        </p>
      </div>
      <DocumentAssistantForm />
    </div>
  );
}
