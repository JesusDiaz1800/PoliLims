
import { SoporteChat } from '@/components/soporte/soporte-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Soporte de Laboratorio',
};

export default function SoportePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
       <div className="space-y-2 text-center mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          Soporte de Laboratorio
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Inicia una conversación con el asistente. Puedes preguntar sobre procedimientos o describir problemas para obtener un diagnóstico. El sistema ha leído todos los documentos de la base de conocimiento.
        </p>
      </div>
      <SoporteChat />
    </div>
  );
}
