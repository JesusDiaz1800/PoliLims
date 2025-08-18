
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CapacitacionForm } from "./capacitacion-form";
import type { Capacitacion, User } from "@/context/data-context";

interface CapacitacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  capacitacion: Capacitacion | null;
  users: User[];
}

export function CapacitacionDialog({ isOpen, onClose, capacitacion, users }: CapacitacionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{capacitacion ? "Gestionar" : "Planificar"} Capacitación</DialogTitle>
          <DialogDescription>
            {capacitacion
              ? `Gestionando la capacitación "${capacitacion.nombre}".`
              : "Complete el formulario para planificar una nueva capacitación."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto custom-scrollbar -mr-6 pr-6">
            <CapacitacionForm
                capacitacionToEdit={capacitacion}
                onFormSubmit={onClose}
                users={users}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
