
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ReprocesadoForm } from "./reprocesado-form";
import type { Ensayo } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface ReprocesadoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo | null;
  analistas: Option[];
}

export function ReprocesadoDialog({ isOpen, onClose, ensayo, analistas }: ReprocesadoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{ensayo ? "Editar" : "Registrar"} Ensayo: Reprocesado</DialogTitle>
          <DialogDescription>
            {ensayo
              ? `Editando los resultados para el ensayo ${ensayo.id}.`
              : "Complete el formulario para registrar un nuevo ensayo de material reprocesado."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
           <ScrollArea className="h-full px-6 pb-6">
              <ReprocesadoForm
                  analistas={analistas}
                  ensayoToEdit={ensayo}
                  onFormSubmit={onClose}
              />
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
