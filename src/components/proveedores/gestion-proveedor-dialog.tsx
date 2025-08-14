

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
      <DialogContent className="sm:max-w-3xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{proveedor ? "Editar" : "Registrar"} Proveedor</DialogTitle>
          <DialogDescription>
            {proveedor
              ? `Editando la información para ${proveedor.nombre}.`
              : "Complete el formulario para añadir un nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-6">
          <GestionProveedorForm
              proveedorToEdit={proveedor}
              onFormSubmit={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
