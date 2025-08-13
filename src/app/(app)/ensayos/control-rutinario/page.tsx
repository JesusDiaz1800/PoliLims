"use client";

import React, { useState } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import Loading from '../../loading';
import { useDynamicData } from '@/context/data-context';

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { registros, ensayos, matrizProductos, sapProducts, isLoaded, deleteRegistro } = useDynamicData();

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (!isLoaded) {
    return <Loading />;
  }

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
        productos={sapProducts}
        matrizProductos={matrizProductos}
      />
    </div>
  );
}
