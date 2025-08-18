
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{capacitacion ? "Editar" : "Planificar"} Capacitación</DialogTitle>
          <DialogDescription>
            {capacitacion
              ? `Editando los detalles para la capacitación "${capacitacion.nombre}".`
              : "Complete el formulario para planificar una nueva capacitación."}
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
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
