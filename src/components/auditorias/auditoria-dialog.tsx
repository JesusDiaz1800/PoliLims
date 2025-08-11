
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuditoriaForm } from "./auditoria-form";
import type { Auditoria, User } from "@/context/data-context";

interface AuditoriaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  auditoria: Auditoria | null;
  users: User[];
}

export function AuditoriaDialog({ isOpen, onClose, auditoria, users }: AuditoriaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{auditoria ? "Editar" : "Planificar"} Auditoría</DialogTitle>
          <DialogDescription>
            {auditoria
              ? `Editando la auditoría ${auditoria.id}.`
              : "Complete el formulario para planificar una nueva auditoría."}
          </DialogDescription>
        </DialogHeader>
        <AuditoriaForm
            auditoriaToEdit={auditoria}
            onFormSubmit={onClose}
            users={users}
        />
      </DialogContent>
    </Dialog>
  );
}
