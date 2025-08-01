
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

interface ControlRutinarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productos: { value: string, label: string }[];
  matrizProductos: TipoProducto[];
}

export function ControlRutinarioDialog({ isOpen, onClose, productos, matrizProductos }: ControlRutinarioDialogProps) {

  const inspectores = [
      { value: "elias.ibanez", label: "ELIAS IBAÑEZ" },
      { value: "cristian.montellano", label: "CRISTIAN MONTELLANO" },
      { value: "daniel.palma", label: "DANIEL PALMA" },
      { value: "luis.parada", label: "LUIS PARADA" },
  ];

  const maquinistas = [
      { value: "andres.reyes", label: "ANDRÉS REYES" },
      { value: "alexis.sandoval", label: "ALEXIS SANDOVAL" },
      { value: "carlos.dominguez", label: "CARLOS DOMÍNGUEZ" },
      { value: "cristian.duque", label: "CRISTIAN DUQUE" },
      { value: "eliaxer.bustos", label: "ELIAXER BUSTOS" },
      { value: "ignacio.herrera", label: "IGNACIO HERRERA" },
      { value: "joniel.joseph", label: "JONIEL JOSEPH" },
      { value: "jorge.garcia", label: "JORGE GARCÍA" },
      { value: "moises.fernandez", label: "MOISES FERNANDEZ" },
      { value: "ramon.salgado", label: "RAMÓN SALGADO" },
      { value: "sebastian.serra", label: "SEBASTIÁN SERRA" },
      { value: "segundo.pichilef", label: "SEGUNDO PICHILEF" },
      { value: "phaniel.phariluz", label: "PHANIEL PHARILUZ" },
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
    { value: "polifusion", label: "POLIFUSIÓN S.A." },
    { value: "smart pipes", label: "SMART PIPES SpA" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Formulario de Control Rutinario de Tuberías</DialogTitle>
          <DialogDescription>
            Registro diario de control de calidad realizado por los inspectores en la línea de producción.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-6 -mr-6 custom-scrollbar">
            <ControlRutinarioForm
            inspectores={inspectores}
            maquinistas={maquinistas}
            maquinas={maquinas}
            productos={productos}
            marcas={marcas}
            matrizProductos={matrizProductos}
            onFormSubmit={onClose}
            />
        </div>
      </DialogContent>
    </Dialog>
  );
}
