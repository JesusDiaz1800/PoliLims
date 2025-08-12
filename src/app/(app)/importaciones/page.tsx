
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { ImportacionesTable } from '@/components/importaciones/importaciones-table';
import { ImportacionDialog } from '@/components/importaciones/importacion-dialog';
import type { Importacion } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';


export default function ImportacionesPage() {
  const { importaciones, isLoaded } = useDynamicData();
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

  if (!isLoaded) {
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
