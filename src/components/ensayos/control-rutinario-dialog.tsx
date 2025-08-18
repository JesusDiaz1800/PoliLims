
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TipoProducto } from "@/lib/matriz-datos";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

interface ControlRutinarioDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productos: { label: string; value: string }[];
  matrizProductos: TipoProducto[];
}

const formSchema = z.object({
  fecha_ingreso: z.date({ 
    required_error: "La fecha es requerida.",
    invalid_type_error: "Formato de fecha inválido." 
  }),
  hora: z.string().nonempty("La hora es requerida."),
  inspector: z.string().nonempty("El inspector es requerido."),
  maquinista: z.string().nonempty("El maquinista es requerido."),
  maquina: z.string().nonempty("La máquina es requerida."),
  producto: z.string().nonempty("El producto es requerido."),
  marca: z.string().nonempty("La marca es requerida."),
  diametro: z.number().optional(),
  espesor_min: z.number().optional(),
  espesor_max: z.number().optional(),
  largo: z.number().optional(),
  peso_muestra: z.number().optional(),
  peso_kg_m: z.number().optional(),
  ovalidad: z.number().optional(),
  observaciones_visuales: z.string().optional(),
  color_tuberia: z.string().optional(),
  color_linea: z.string().optional(),
  entregado_laboratorio: z.boolean().default(false),
}).passthrough();


type FormValues = z.infer<typeof formSchema>;

const defaultFormValues: Partial<FormValues> = {
  fecha_ingreso: new Date(),
  hora: format(new Date(), 'HH:mm'),
  inspector: '',
  maquinista: '',
  maquina: '',
  producto: '',
  marca: '',
  entregado_laboratorio: false,
};


export function ControlRutinarioDialog({ isOpen, onClose, productos, matrizProductos }: ControlRutinarioDialogProps) {

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

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
          <div className="h-full overflow-y-auto pr-6 custom-scrollbar">
            <ControlRutinarioForm
              form={form}
              inspectores={inspectores}
              maquinistas={maquinistas}
              maquinas={maquinas}
              marcas={marcas}
              onFormSubmit={onClose}
              productos={productos}
              matrizProductos={matrizProductos}
              defaultFormValues={defaultFormValues}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
