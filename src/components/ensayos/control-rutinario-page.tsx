"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDynamicData } from '@/context/data-context';

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

export type ControlRutinarioFormValues = z.infer<typeof formSchema>;

const defaultFormValues: Partial<ControlRutinarioFormValues> = {
  fecha_ingreso: new Date(),
  hora: format(new Date(), 'HH:mm'),
  inspector: '',
  maquinista: '',
  maquina: '',
  producto: '',
  marca: '',
  entregado_laboratorio: false,
};


export default function ControlRutinarioPageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { registros, ensayos, matrizProductos, deleteRegistro } = useDynamicData();

  const form = useForm<ControlRutinarioFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });


  const handleAddRecordClick = () => {
    form.reset(defaultFormValues);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  const productOptions = matrizProductos.map(p => ({
    value: p.producto,
    label: p.producto,
  }));

  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        registros={registros}
        ensayos={ensayos}
        onAddRecordClick={handleAddRecordClick}
        onDelete={deleteRegistro}
      />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={productOptions}
        matrizProductos={matrizProductos}
        form={form}
        defaultFormValues={defaultFormValues}
      />
    </div>
  );
}
