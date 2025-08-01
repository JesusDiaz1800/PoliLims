
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { ReprocesadoTable } from '@/components/ensayos/reprocesado-table';
import { ReprocesadoDialog } from '@/components/ensayos/reprocesado-dialog';
import type { Ensayo } from '@/context/data-context';

export default function ReprocesadoPage() {
  const { ensayos, isLoading } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);

  const handleOpenDialog = (ensayo?: Ensayo) => {
    setSelectedEnsayo(ensayo || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedEnsayo(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  const reprocesadoEnsayos = ensayos.filter(e => e.tipo === 'Reprocesado');
  
  const analistas = [
      { value: "jesus.diaz", label: "Jesus Diaz" },
      { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
      { value: "antonia.figueroa", label: "Antonia Figueroa" },
      { value: "robinson.cordova", label: "Robinson Córdova" },
      { value: "bryan.vasquez", label: "Bryan Vásquez" },
  ];

  return (
    <div className="space-y-6">
      <ReprocesadoTable
        ensayos={reprocesadoEnsayos}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <ReprocesadoDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        ensayo={selectedEnsayo}
        analistas={analistas}
      />
    </div>
  );
}
