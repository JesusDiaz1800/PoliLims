
"use client";

import React, { useState, useEffect } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDynamicData } from '@/context/data-context';

export default function ControlRutinarioPageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { registros, ensayos, matrizProductos, deleteRegistro } = useDynamicData();

  const handleAddRecordClick = () => {
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
      />
    </div>
  );
}
