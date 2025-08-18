
"use client";

import * as React from 'react';
import type { Proveedor } from '@/context/data-context';
import { GestionProveedoresTable } from '@/components/proveedores/gestion-proveedores-table';
import { GestionProveedorDialog } from '@/components/proveedores/gestion-proveedor-dialog';
import { useDynamicData } from '@/context/data-context';

export default function GestionProveedoresPageContent() {
  const { proveedores, deleteProveedor } = useDynamicData();
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

  return (
    <div className="space-y-6">
      <GestionProveedoresTable
        proveedores={proveedores}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={deleteProveedor}
      />
      <GestionProveedorDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        proveedor={selectedProveedor}
      />
    </div>
  );
}
