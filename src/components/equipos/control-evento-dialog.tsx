

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDynamicData, type Equipo } from "@/context/data-context";
import { ControlEventoForm } from "./control-evento-form";

interface ControlEventoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  equipo: Equipo;
}


export function ControlEventoDialog({ isOpen, onClose, equipo }: ControlEventoDialogProps) {
  const { addControlEvento, updateEquipo, addRecentActivity } = useDynamicData();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Evento de Control</DialogTitle>
          <DialogDescription>
            Añada un nuevo registro de calibración, verificación o mantenimiento para el equipo <span className="font-bold">{equipo.nombre}</span>.
          </DialogDescription>
        </DialogHeader>
        <ControlEventoForm
            equipo={equipo}
            onFormSubmit={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
