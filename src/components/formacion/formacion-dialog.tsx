
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormacionForm } from "./formacion-form";
import type { Formacion, User } from "@/context/data-context";

interface FormacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: Formacion | null;
  users: User[];
}

export function FormacionDialog({ isOpen, onClose, record, users }: FormacionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{record ? "Editar" : "Registrar"} Actividad de Formación</DialogTitle>
          <DialogDescription>
            {record
              ? `Editando la actividad de formación para ${record.empleadoNombre}.`
              : "Complete el formulario para añadir un nuevo registro de formación."}
          </DialogDescription>
        </DialogHeader>
        <FormacionForm
            recordToEdit={record}
            onFormSubmit={onClose}
            users={users}
        />
      </DialogContent>
    </Dialog>
  );
}
