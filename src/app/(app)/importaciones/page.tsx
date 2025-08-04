
"use client";

import * as React from 'react';
import { useDynamicData, type Importacion } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { ImportacionesTable } from '@/components/importaciones/importaciones-table';
import { ImportacionDialog } from '@/components/importaciones/importacion-dialog';

export default function ImportacionesPage() {
  const { importaciones, isLoading } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedImportacion, setSelectedImportacion] = React.useState<Importacion | null>(null);

  const handleOpenDialog = (importacion?: Importacion) => {
    setSelectedImportacion(importacion || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedImportacion(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <ImportacionesTable
        importaciones={importaciones}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <ImportacionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        importacion={selectedImportacion}
      />
    </div>
  );
}
