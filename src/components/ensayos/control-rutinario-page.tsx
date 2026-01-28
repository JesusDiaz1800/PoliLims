"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDynamicData } from '@/context/data-context';
import type { ControlRutinarioFormValues } from '@/app/(app)/control-rutinario/page';


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
    defaultValues: defaultFormValues,
  });


  const handleAddRecordClick = () => {
    form.reset(defaultFormValues);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  
  const productOptions = (matrizProductos || []).map(p => ({
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
