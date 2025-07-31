
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

interface Option {
  value: string;
  label: string;
}

interface ControlRutinarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Option[];
  matrizProductos: TipoProducto[];
}

export function ControlRutinarioDialog({ isOpen, onClose, productos, matrizProductos }: ControlRutinarioDialogProps) {

  const inspectores = [
    { value: "elias.ibanez", label: "Elias Ibañez" },
    { value: "cristian.montellano", label: "Cristian Montellano" },
    { value: "daniel.palma", label: "Daniel Palma" },
    { value: "luis.parada", label: "Luis Parada" },
  ];

  const maquinistas = [
    { value: "andres.reyes", label: "Andrés Reyes" },
    { value: "alexis.sandoval", label: "Alexis Sandoval" },
    { value: "carlos.dominguez", label: "Carlos Domínguez" },
    { value: "cristian.duque", label: "Cristian Duque" },
    { value: "eliaxer.bustos", label: "Eliaxer Bustos" },
    { value: "ignacio.herrera", label: "Ignacio Herrera" },
    { value: "joniel.joseph", label: "Joniel Joseph" },
    { value: "jorge.garcia", label: "Jorge García" },
    { value: "moises.fernandez", label: "Moises Fernandez" },
    { value: "ramon.salgado", label: "Ramón Salgado" },
    { value: "sebastian.serra", label: "Sebastián Serra" },
    { value: "segundo.pichilef", label: "Segundo Pichilef" },
    { value: "phaniel.phariluz", label: "Phaniel Phariluz" },
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
    { value: "smartpipes", label: "SMART PIPES SpA" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Formulario de Control Rutinario de Tuberías</DialogTitle>
          <DialogDescription>
            Registro diario de control de calidad realizado por los inspectores en la línea de producción.
          </DialogDescription>
        </DialogHeader>
        <ControlRutinarioForm
          inspectores={inspectores}
          maquinistas={maquinistas}
          maquinas={maquinas}
          productos={productos}
          marcas={marcas}
          matrizProductos={matrizProductos}
          onFormSubmit={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
