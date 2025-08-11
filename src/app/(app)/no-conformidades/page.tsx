
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { NoConformidadDialog } from '@/components/no-conformidades/no-conformidad-dialog';
import { NoConformidadTable } from '@/components/no-conformidades/no-conformidad-table';
import { useDynamicData, type NoConformidad, type Ensayo, type Equipo } from '@/context/data-context';

export default function NoConformidadesPage() {
  const { noConformidades, equipos, ensayos, isLoaded } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = React.useState<NoConformidad | null>(null);

  const handleOpenDialog = (incidencia?: NoConformidad) => {
    setSelectedIncidencia(incidencia || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedIncidencia(null);
    setIsDialogOpen(false);
  };
  
  const analistas = React.useMemo(() => {
    if (!isLoaded) return [];
    return [...new Set(ensayos.map(e => e.analista).filter(Boolean))].map(a => ({ value: a, label: a }))
  }, [ensayos, isLoaded]);
  
  const productosAfectados = React.useMemo(() => {
    if (!isLoaded) return [];
    return [...new Set(ensayos.map(e => e.producto).filter(Boolean))].map(p => ({ value: p, label: p }))
  }, [ensayos, isLoaded]);

  const equiposImplicados = React.useMemo(() => {
    if (!isLoaded) return [];
    return equipos.map(e => ({ value: e.id, label: `${e.nombre} (${e.id})` }))
  }, [equipos, isLoaded]);

  if (!isLoaded) {
    return <Loading />;
  }
  
  return (
    <div className="space-y-6">
      <NoConformidadTable
        incidencias={noConformidades}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <NoConformidadDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        incidencia={selectedIncidencia}
        analistas={analistas}
        productosAfectados={productosAfectados}
        equiposImplicados={equiposImplicados}
      />
    </div>
  );
}
