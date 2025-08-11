
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { EquiposTable } from '@/components/equipos/equipos-table';
import { EquipoDialog } from '@/components/equipos/equipo-dialog';
import type { Equipo } from '@/context/data-context';
import * as dataService from "@/services/data-service";

export default function EquiposPage() {
  const [equipos, setEquipos] = React.useState<Equipo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isEquipoDialogOpen, setIsEquipoDialogOpen] = React.useState(false);
  const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | null>(null);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await dataService.getInitialData();
      setEquipos(data.equipos);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleOpenEquipoDialog = (equipo?: Equipo) => {
    setSelectedEquipo(equipo || null);
    setIsEquipoDialogOpen(true);
  };

  const handleCloseEquipoDialog = () => {
    setSelectedEquipo(null);
    setIsEquipoDialogOpen(false);
  };

  if (isLoading) {
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
