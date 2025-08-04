
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ControlRutinarioForm } from "./control-rutinario-form";
import { TipoProducto } from "@/lib/matriz-datos";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ControlRutinarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productos: { value: string, label: string }[];
  matrizProductos: TipoProducto[];
}

export function ControlRutinarioDialog({ isOpen, onClose, productos, matrizProductos }: ControlRutinarioDialogProps) {

  const inspectores = [
      { value: "ELIAS IBAÑEZ", label: "ELIAS IBAÑEZ" },
      { value: "CRISTIAN MONTELLANO", label: "CRISTIAN MONTELLANO" },
      { value: "DANIEL PALMA", label: "DANIEL PALMA" },
      { value: "LUIS PARADA", label: "LUIS PARADA" },
  ];

  const maquinistas = [
      { value: "ANDRÉS REYES", label: "ANDRÉS REYES" },
      { value: "ALEXIS SANDOVAL", label: "ALEXIS SANDOVAL" },
      { value: "CARLOS DOMÍNGUEZ", label: "CARLOS DOMÍNGUEZ" },
      { value: "CRISTIAN DUQUE", label: "CRISTIAN DUQUE" },
      { value: "ELIAXER BUSTOS", label: "ELIAXER BUSTOS" },
      { value: "IGNACIO HERRERA", label: "IGNACIO HERRERA" },
      { value: "JONIEL JOSEPH", label: "JONIEL JOSEPH" },
      { value: "JORGE GARCÍA", label: "JORGE GARCÍA" },
      { value: "MOISES FERNANDEZ", label: "MOISES FERNANDEZ" },
      { value: "RAMÓN SALGADO", label: "RAMÓN SALGADO" },
      { value: "SEBASTIÁN SERRA", label: "SEBASTIÁN SERRA" },
      { value: "SEGUNDO PICHILEF", label: "SEGUNDO PICHILEF" },
      { value: "PHANIEL PHARILUZ", label: "PHANIEL PHARILUZ" },
  ];

  const maquinas = [
    { value: "0", label: "Máquina 0" },
    { value: "2", label: "Máquina 2" },
    { value: "3", label: "Máquina 3" },
    { value: "4", label: "Máquina 4" },
    { value: "5", label: "Máquina 5" },
    { value: "6", label: "Máquina 6" },
    { value: "7", label: "Máquina 7" },
    { value: "8", label: "Máquina 8" },
    { value: "9", label: "Máquina 9" },
    { value: "10", label: "Máquina 10" },
    { value: "11", label: "Máquina 11" },
    { value: "PE1", label: "PE1" },
    { value: "PE2", label: "PE2" },
    { value: "PE3", label: "PE3" },
    { value: "PE4", label: "PE4" },
  ];

  const marcas = [
    { value: "POLIFUSIÓN S.A.", label: "POLIFUSIÓN S.A." },
    { value: "SMART PIPES SpA", label: "SMART PIPES SpA" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Formulario de Control Rutinario de Tuberías</DialogTitle>
          <DialogDescription>
            Registro diario de control de calidad realizado por los inspectores en la línea de producción.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-6">
            <ControlRutinarioForm
              inspectores={inspectores}
              maquinistas={maquinistas}
              maquinas={maquinas}
              productos={productos}
              marcas={marcas}
              matrizProductos={matrizProductos}
              onFormSubmit={onClose}
            />
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
