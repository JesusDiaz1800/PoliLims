
"use client";

import * as React from 'react';
import type { Proveedor } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { GestionProveedoresTable } from '@/components/proveedores/gestion-proveedores-table';
import { GestionProveedorDialog } from '@/components/proveedores/gestion-proveedor-dialog';
import * as dataService from '@/services/data-service';
import { useDynamicData } from '@/context/data-context';

/**
 * @component GestionProveedoresPage
 * @description Page component for managing suppliers. It fetches and displays a list of suppliers,
 * and handles the creation and editing of suppliers through a dialog.
 * It uses a useCallback for the data loading function to optimize performance.
 */
export default function GestionProveedoresPage() {
  const { proveedores, isLoaded } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProveedor, setSelectedProveedor] = React.useState<Proveedor | null>(null);
  
  /**
   * @function handleOpenDialog
   * @description Opens the supplier dialog. If a supplier is passed, it opens in edit mode.
   * Otherwise, it opens in creation mode.
   * @param {Proveedor} [proveedor] - The supplier to edit.
   */
  const handleOpenDialog = (proveedor?: Proveedor) => {
    setSelectedProveedor(proveedor || null);
    setIsDialogOpen(true);
  };

  /**
   * @function handleCloseDialog
   * @description Closes the supplier dialog and reloads the data to reflect any changes.
   */
  const handleCloseDialog = () => {
    setSelectedProveedor(null);
    setIsDialogOpen(false);
  };

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <GestionProveedoresTable
        proveedores={proveedores}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <GestionProveedorDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        proveedor={selectedProveedor}
      />
    </div>
  );
}
