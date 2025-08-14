

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NoConformidadForm } from "./no-conformidad-form";
import type { NoConformidad } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface NoConformidadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  incidencia: NoConformidad | null;
  analistas: Option[];
  productosAfectados: Option[];
  equiposImplicados: Option[];
}

export function NoConformidadDialog({ 
    isOpen, 
    onClose, 
    incidencia, 
    analistas, 
    productosAfectados, 
    equiposImplicados 
}: NoConformidadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{incidencia ? "Editar" : "Registrar"} No Conformidad</DialogTitle>
          <DialogDescription>
            {incidencia
              ? `Editando la incidencia ${incidencia.id}.`
              : "Complete el formulario para registrar una nueva incidencia o no conformidad."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-6">
            <NoConformidadForm
                incidenciaToEdit={incidencia}
                onFormSubmit={onClose}
                analistas={analistas}
                productosAfectados={productosAfectados}
                equiposImplicados={equiposImplicados}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
