"use client";

import React, { useState } from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDynamicData } from '@/context/data-context';

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { registros, ensayos } = useDynamicData();

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ControlRutinarioTable 
        registros={registros}
        ensayos={ensayos}
        onAddRecordClick={handleAddRecordClick} 
      />
      
    </div>
  );
}
