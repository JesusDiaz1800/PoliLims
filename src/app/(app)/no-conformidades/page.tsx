
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { NoConformidadDialog } from '@/components/no-conformidades/no-conformidad-dialog';
import { NoConformidadTable } from '@/components/no-conformidades/no-conformidad-table';
import type { NoConformidad } from '@/context/data-context';


export default function NoConformidadesPage() {
  const { noConformidades, isLoading, equipos, ensayos } = useDynamicData();
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
    if (isLoading) return [];
    return [...new Set(ensayos.map(e => e.analista).filter(Boolean))].map(a => ({ value: a, label: a }))
  }, [ensayos, isLoading]);
  
  const productosAfectados = React.useMemo(() => {
    if (isLoading) return [];
    return [...new Set(ensayos.map(e => e.producto).filter(Boolean))].map(p => ({ value: p, label: p }))
  }, [ensayos, isLoading]);

  const equiposImplicados = React.useMemo(() => {
    if (isLoading) return [];
    return equipos.map(e => ({ value: e.id, label: `${e.nombre} (${e.id})` }))
  }, [equipos, isLoading]);

  if (isLoading) {
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
