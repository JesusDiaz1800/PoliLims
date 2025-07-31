
"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";
import { useDataContext } from "@/context/data-context";
import Loading from "../../loading";

export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { sapProducts, productMatrix, loading } = useDataContext();

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} />
      <ControlRutinarioDialog 
        isOpen={isDialogOpen} 
        onClose={handleDialogClose} 
        productos={sapProducts}
        matrizProductos={productMatrix}
      />
    </div>
  );
}
