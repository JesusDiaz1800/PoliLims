
"use client";

import * as React from 'react';
import { useDynamicData, type Proveedor } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { GestionProveedoresTable } from '@/components/proveedores/gestion-proveedores-table';
import { GestionProveedorDialog } from '@/components/proveedores/gestion-proveedor-dialog';

export default function GestionProveedoresPage() {
  const { proveedores, isLoading } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedProveedor, setSelectedProveedor] = React.useState<Proveedor | null>(null);

  const handleOpenDialog = (proveedor?: Proveedor) => {
    setSelectedProveedor(proveedor || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProveedor(null);
    setIsDialogOpen(false);
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
