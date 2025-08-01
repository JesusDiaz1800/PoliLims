
"use client";

import * as React from 'react';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';
import type { Ensayo } from '@/context/data-context';

export default function TuberiasPpPage() {
  const { ensayos, isLoading } = useDynamicData();
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);

  const handleOpenDialog = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
  };

  const handleCloseDialog = () => {
    setSelectedEnsayo(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  const ppEnsayos = ensayos.filter(e => e.tipo === 'Tubería PP');

  return (
    <div className="space-y-6">
      <EnsayosProductoTerminadoTable
        ensayos={ppEnsayos}
        tipoEnsayo="PP"
        onOpenDialog={handleOpenDialog}
      />
      {selectedEnsayo && (
        <EnsayoProductoTerminadoDialog
          isOpen={!!selectedEnsayo}
          onClose={handleCloseDialog}
          ensayo={selectedEnsayo}
          tipo="PP"
        />
      )}
    </div>
  );
}
