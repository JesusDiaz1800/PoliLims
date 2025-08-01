
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MateriaPrimaForm } from "./materia-prima-form";
import type { Ensayo } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface MateriaPrimaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo | null;
  analistas: Option[];
}

export function MateriaPrimaDialog({ isOpen, onClose, ensayo, analistas }: MateriaPrimaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{ensayo ? "Editar" : "Registrar"} Ensayo: Materia Prima</DialogTitle>
          <DialogDescription>
            {ensayo
              ? `Editando los resultados para el ensayo ${ensayo.id}.`
              : "Complete el formulario para registrar un nuevo ensayo de materia prima."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-6 -mr-2">
            <MateriaPrimaForm
                analistas={analistas}
                ensayoToEdit={ensayo}
                onFormSubmit={onClose}
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
