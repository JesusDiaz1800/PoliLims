
"use client";

import * as React from 'react';
import { NoConformidadDialog } from '@/components/no-conformidades/no-conformidad-dialog';
import { NoConformidadTable } from '@/components/no-conformidades/no-conformidad-table';
import { useDynamicData, type NoConformidad } from '@/context/data-context';
import { useSearchParams } from 'next/navigation';

export default function NoConformidadesPageContent() {
  const { noConformidades, equipos, ensayos, deleteIncidencia } = useDynamicData();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = React.useState<NoConformidad | null>(null);

  const initialStatusFilter = searchParams.get('status') || undefined;

  const handleOpenDialog = (incidencia?: NoConformidad) => {
    setSelectedIncidencia(incidencia || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedIncidencia(null);
    setIsDialogOpen(false);
  };
  
  const analistas = React.useMemo(() => {
    return [...new Set(ensayos.map(e => e.analista).filter(Boolean))].map(a => ({ value: a, label: a }))
  }, [ensayos]);
  
  const productosAfectados = React.useMemo(() => {
    return [...new Set(ensayos.map(e => e.producto).filter(Boolean))].map(p => ({ value: p, label: p }))
  }, [ensayos]);

  const equiposImplicados = React.useMemo(() => {
    return equipos.map(e => ({ value: e.id, label: `${e.nombre} (${e.id})` }))
  }, [equipos]);

  return (
    <div className="space-y-6">
      <NoConformidadTable
        incidencias={noConformidades}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={async (id: string) => {
          await deleteIncidencia(id);
        }}
        initialStatusFilter={initialStatusFilter}
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
