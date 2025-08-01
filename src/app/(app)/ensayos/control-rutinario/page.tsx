
"use client";

import React, { useState } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useStaticData } from '@/context/data-context';
import Loading from '../../loading';

export default function ControlRutinarioPage() {
  const { productMatrix, isLoaded } = useStaticData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (!isLoaded) {
    return <Loading />;
  }

  // Transform productMatrix for the combobox
  const productosParaFormulario = productMatrix.map(p => ({
    value: p.code || p.producto.replace(/\s+/g, '-').toUpperCase(),
    label: p.producto,
  }));


  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        onAddRecordClick={handleAddRecordClick} 
        matrizProductos={productMatrix} 
      />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={productosParaFormulario}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
