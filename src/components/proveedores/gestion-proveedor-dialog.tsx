
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GestionProveedorForm } from "./gestion-proveedor-form";
import type { Proveedor } from "@/context/data-context";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GestionProveedorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  proveedor: Proveedor | null;
}

export function GestionProveedorDialog({ isOpen, onClose, proveedor }: GestionProveedorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{proveedor ? "Editar" : "Registrar"} Proveedor</DialogTitle>
          <DialogDescription>
            {proveedor
              ? `Editando la información para ${proveedor.nombre}.`
              : "Complete el formulario para añadir un nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-3 -mr-2 custom-scrollbar">
          <GestionProveedorForm
              proveedorToEdit={proveedor}
              onFormSubmit={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
