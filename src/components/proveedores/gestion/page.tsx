
"use client";

import * as React from 'react';
import type { Proveedor } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { GestionProveedoresTable } from '@/components/proveedores/gestion-proveedores-table';
import { GestionProveedorDialog } from '@/components/proveedores/gestion-proveedor-dialog';
import * as dataService from '@/services/data-service';

/**
 * @component GestionProveedoresPage
 * @description Page component for managing suppliers. It fetches and displays a list of suppliers,
 * and handles the creation and editing of suppliers through a dialog.
 * It uses a useCallback for the data loading function to optimize performance.
 */
export default function GestionProveedoresPage() {
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProveedor, setSelectedProveedor] = React.useState<Proveedor | null>(null);

  /**
   * @callback loadData
   * @description Fetches the list of suppliers from the data service.
   * This function is memoized with useCallback to prevent unnecessary re-creations,
   * which is useful if passed down to child components.
   */
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await dataService.getInitialData();
        setProveedores(data.proveedores);
    } catch (error) {
        console.error("Failed to load proveedores", error);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  React.useEffect(() => {
    loadData();
  }, [loadData]);

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
    loadData();
  };

  if (isLoading) {
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
