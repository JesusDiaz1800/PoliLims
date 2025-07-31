
"use client";

import React, { useEffect, useState } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useStaticData } from '@/context/data-context';
import Loading from '../../loading';

export default function ControlRutinarioPage() {
  const { sapProducts, productMatrix, isLoaded } = useStaticData();
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

  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        onAddRecordClick={handleAddRecordClick} 
        matrizProductos={productMatrix} 
      />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
