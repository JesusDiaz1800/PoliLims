
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { NoConformidadDialog } from '@/components/no-conformidades/no-conformidad-dialog';
import { NoConformidadTable } from '@/components/no-conformidades/no-conformidad-table';
import { useDynamicData, type NoConformidad } from '@/context/data-context';
import { useSearchParams } from 'next/navigation';
import { FilterProvider } from '@/context/filter-context';

/**
 * @component NoConformidadesPage
 * @description Page for managing non-conformities. It fetches all necessary data from the dynamic data context,
 * including non-conformities, equipment, and assays, to populate the table and dialog forms.
 */
function NoConformidadesPageContent() {
  const { noConformidades, equipos, ensayos, isLoaded, deleteIncidencia } = useDynamicData();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = React.useState<NoConformidad | null>(null);

  const initialStatusFilter = searchParams.get('status') || undefined;

  /**
   * @function handleOpenDialog
   * @description Opens the dialog for creating a new non-conformity or editing an existing one.
   * @param {NoConformidad} [incidencia] - The non-conformity object to edit.
   */
  const handleOpenDialog = (incidencia?: NoConformidad) => {
    setSelectedIncidencia(incidencia || null);
    setIsDialogOpen(true);
  };

  /**
   * @function handleCloseDialog
   * @description Closes the dialog and resets the selected non-conformity state.
   */
  const handleCloseDialog = () => {
    setSelectedIncidencia(null);
    setIsDialogOpen(false);
  };
  
  // Memoized list of analysts derived from the assays data.
  const analistas = React.useMemo(() => {
    if (!isLoaded) return [];
    return [...new Set(ensayos.map(e => e.analista).filter(Boolean))].map(a => ({ value: a, label: a }))
  }, [ensayos, isLoaded]);
  
  // Memoized list of affected products derived from the assays data.
  const productosAfectados = React.useMemo(() => {
    if (!isLoaded) return [];
    return [...new Set(ensayos.map(e => e.producto).filter(Boolean))].map(p => ({ value: p, label: p }))
  }, [ensayos, isLoaded]);

  // Memoized list of involved equipment.
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
        onDelete={deleteIncidencia}
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

export default function NoConformidadesPage() {
    return (
        <FilterProvider>
            <NoConformidadesPageContent />
        </FilterProvider>
    )
}
