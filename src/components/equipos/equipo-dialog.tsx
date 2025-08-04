
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EquipoForm } from "./equipo-form";
import type { Equipo } from "@/context/data-context";
import { ScrollArea } from "../ui/scroll-area";

interface EquipoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: Equipo | null;
}

export function EquipoDialog({ isOpen, onClose, equipo }: EquipoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{equipo ? "Editar" : "Registrar"} Equipo</DialogTitle>
          <DialogDescription>
            {equipo
              ? `Editando la información para el equipo ${equipo.nombre}.`
              : "Complete el formulario para añadir un nuevo equipo al inventario."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-2">
          <EquipoForm
              equipoToEdit={equipo}
              onFormSubmit={onClose}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
