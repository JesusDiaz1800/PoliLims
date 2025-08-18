
"use client";

import * as React from 'react';
import { ImportacionesTable } from '@/components/importaciones/importaciones-table';
import { ImportacionDialog } from '@/components/importaciones/importacion-dialog';
import type { Importacion } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';


function ImportacionesPageContent() {
  const { importaciones, deleteImportacion } = useDynamicData();
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

  return (
    <div className="space-y-6">
      <ImportacionesTable
        importaciones={importaciones}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={deleteImportacion}
      />
      <ImportacionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        importacion={selectedImportacion}
      />
    </div>
  );
}

export default function ImportacionesPage() {
    return (
        <FilterProvider>
            <ImportacionesPageContent />
        </FilterProvider>
    )
}
