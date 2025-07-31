
"use client";

import { ControlRutinarioTable } from "@/components/ensayos/control-rutinario-table";
import * as React from 'react';
import { ControlRutinarioDialog } from "@/components/ensayos/control-rutinario-dialog";


export default function ControlRutinarioPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddRecordClick = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <ControlRutinarioTable onAddRecordClick={handleAddRecordClick} />
      <ControlRutinarioDialog isOpen={isDialogOpen} onClose={handleDialogClose} />
    </div>
  );
}
