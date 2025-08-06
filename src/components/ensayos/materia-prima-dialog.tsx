
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MateriaPrimaForm } from "./materia-prima-form";
import type { Ensayo } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";
import type { User } from "@/services/user-service";

interface Option {
  value: string;
  label: string;
}

interface MateriaPrimaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo | null;
  analistas: Option[];
  user: User;
}

export function MateriaPrimaDialog({ isOpen, onClose, ensayo, analistas, user }: MateriaPrimaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{ensayo ? "Editar" : "Registrar"} Ensayo: Materia Prima</DialogTitle>
          <DialogDescription>
            {ensayo
              ? `Editando los resultados para el ensayo ${ensayo.id}.`
              : "Complete el formulario para registrar un nuevo ensayo de materia prima."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full px-6 pb-6">
                <MateriaPrimaForm
                    analistas={analistas}
                    ensayoToEdit={ensayo}
                    onFormSubmit={onClose}
                    user={user}
                />
            </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
