
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { EquiposTable } from '@/components/equipos/equipos-table';
import { EquipoDialog } from '@/components/equipos/equipo-dialog';
import type { Equipo } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';

export default function EquiposPage() {
  const { equipos, isLoaded } = useDynamicData();
  const [isEquipoDialogOpen, setIsEquipoDialogOpen] = React.useState(false);
  const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | null>(null);

  const handleOpenEquipoDialog = (equipo?: Equipo) => {
    setSelectedEquipo(equipo || null);
    setIsEquipoDialogOpen(true);
  };

  const handleCloseEquipoDialog = () => {
    setSelectedEquipo(null);
    setIsEquipoDialogOpen(false);
  };

  if (!isLoaded) {
    return <Loading />;
  }
  
  return (
    <div className="space-y-6">
      <EquiposTable
        equipos={equipos}
        onAddNew={() => handleOpenEquipoDialog()}
        onEdit={handleOpenEquipoDialog}
      />
      <EquipoDialog
        isOpen={isEquipoDialogOpen}
        onClose={handleCloseEquipoDialog}
        equipo={selectedEquipo}
      />
    </div>
  );
}
