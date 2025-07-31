
"use client";

import * as React from 'react';
import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { type SapProduct } from "@/services/sap-service";
import { type TipoProducto } from "@/lib/matriz-datos";

interface ControlRutinarioClientProps {
  sapProducts: SapProduct[];
  productMatrix: TipoProducto[];
}

export function ControlRutinarioClient({ sapProducts, productMatrix }: ControlRutinarioClientProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} matrizProductos={productMatrix} />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </>
  );
}
