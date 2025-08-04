
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ImportacionForm } from "./importacion-form";
import type { Importacion } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";

interface ImportacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  importacion: Importacion | null;
}

export function ImportacionDialog({ isOpen, onClose, importacion }: ImportacionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{importacion ? "Editar" : "Registrar"} Importación</DialogTitle>
          <DialogDescription>
            {importacion
              ? `Editando la importación con BL ${importacion.bl}.`
              : "Complete el formulario para añadir un nuevo registro de importación."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6">
            <ImportacionForm
                importacionToEdit={importacion}
                onFormSubmit={onClose}
            />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
