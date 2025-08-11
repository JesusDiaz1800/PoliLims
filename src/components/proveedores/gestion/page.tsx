
"use client";

import * as React from 'react';
import type { Proveedor } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { GestionProveedoresTable } from '@/components/proveedores/gestion-proveedores-table';
import { GestionProveedorDialog } from '@/components/proveedores/gestion-proveedor-dialog';
import * as dataService from '@/services/data-service';

export default function GestionProveedoresPage() {
  const [proveedores, setProveedores] = React.useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProveedor, setSelectedProveedor] = React.useState<Proveedor | null>(null);

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

  const handleOpenDialog = (proveedor?: Proveedor) => {
    setSelectedProveedor(proveedor || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProveedor(null);
    setIsDialogOpen(false);
    loadData(); // Recargar datos después de cerrar el diálogo
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

