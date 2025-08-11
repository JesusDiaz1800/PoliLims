
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { PlantillaNotificacion } from "@/services/data-service";
import { Mail } from "lucide-react";

interface PlantillaPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: PlantillaNotificacion | null;
}

export function PlantillaPreviewDialog({ isOpen, onClose, template }: PlantillaPreviewDialogProps) {
  if (!template) return null;
  
  // Reemplazar placeholders con ejemplos
  const getSampleBody = (body: string) => {
    return body
        .replace(/{{equipo.nombre}}/g, 'Espectrómetro FTIR')
        .replace(/{{equipo.id}}/g, 'EQ-01')
        .replace(/{{dias_restantes}}/g, '15')
        .replace(/{{equipo.proxima_calibracion}}/g, '15-08-2025')
        .replace(/{{usuario.nombre}}/g, 'Jesús Díaz')
        .replace(/{{nc.id}}/g, 'NC-025')
        .replace(/{{nc.descripcion}}/g, 'Resultados fuera de especificación en Lote X')
        .replace(/{{nc.fecha_deteccion}}/g, '25-07-2025')
        .replace(/{{nc.fecha_vencimiento}}/g, '10-08-2025');
  }
  
  const getSampleSubject = (subject: string) => {
    return subject
        .replace(/{{equipo.nombre}}/g, 'Espectrómetro FTIR')
        .replace(/{{dias_restantes}}/g, '15')
        .replace(/{{nc.id}}/g, 'NC-025');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vista Previa de Plantilla: {template.nombre}</DialogTitle>
          <DialogDescription>
            Así es como se verá la notificación cuando sea enviada.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground"/>
                <h3 className="font-semibold">Asunto: {getSampleSubject(template.asunto)}</h3>
            </div>
            <div className="border-t pt-4">
                <p className="whitespace-pre-wrap text-sm text-foreground">
                    {getSampleBody(template.cuerpo)}
                </p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

