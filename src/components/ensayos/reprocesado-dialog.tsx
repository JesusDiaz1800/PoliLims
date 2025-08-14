

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReprocesadoForm } from "./reprocesado-form";
import { useDynamicData, type Ensayo } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";
import type { User } from "@/services/user-service";

interface Option {
  value: string;
  label: string;
}

interface ReprocesadoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo | null;
  analistas: Option[];
  defaultTab?: string;
}

export function ReprocesadoDialog({ isOpen, onClose, ensayo, analistas, defaultTab = 'all' }: ReprocesadoDialogProps) {
  const { equipos } = useDynamicData();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{ensayo ? "Editar" : "Registrar"} Ensayo: Reprocesado</DialogTitle>
          <DialogDescription>
            {ensayo
              ? `Editando los resultados para el ensayo ${ensayo.id}.`
              : "Complete el formulario para registrar un nuevo ensayo de material reprocesado."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-6">
              <ReprocesadoForm
                  analistas={analistas}
                  ensayoToEdit={ensayo}
                  onFormSubmit={onClose}
                  equipos={equipos}
                  defaultTab={defaultTab}
              />
            </div>
      </DialogContent>
    </Dialog>
  );
}
