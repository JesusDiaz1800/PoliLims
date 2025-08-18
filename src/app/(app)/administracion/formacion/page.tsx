
"use client";

import * as React from 'react';
import type { Formacion, User } from '@/context/data-context';
import { FormacionTable } from '@/components/formacion/formacion-table';
import { FormacionDialog } from '@/components/formacion/formacion-dialog';
import { useDynamicData } from '@/context/data-context';

export default function RegistrosFormacionPage() {
  const { formacion: data, usuarios, deleteFormacion } = useDynamicData();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<Formacion | null>(null);

  const handleOpenDialog = (record?: Formacion) => {
    setSelectedRecord(record || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <FormacionTable
        data={data}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={deleteFormacion}
      />
      <FormacionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        record={selectedRecord}
        users={usuarios}
      />
    </div>
  );
}
