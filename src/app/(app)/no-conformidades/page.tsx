
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { NoConformidadDialog } from '@/components/no-conformidades/no-conformidad-dialog';
import { NoConformidadTable } from '@/components/no-conformidades/no-conformidad-table';
import type { NoConformidad, Ensayo, Equipo } from '@/context/data-context';
import * as dataService from "@/services/data-service";

export default function NoConformidadesPage() {
  const [noConformidades, setNoConformidades] = React.useState<NoConformidad[]>([]);
  const [equipos, setEquipos] = React.useState<Equipo[]>([]);
  const [ensayos, setEnsayos] = React.useState<Ensayo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedIncidencia, setSelectedIncidencia] = React.useState<NoConformidad | null>(null);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await dataService.getInitialData();
      setNoConformidades(data.noConformidades);
      setEquipos(data.equipos);
      setEnsayos(data.ensayos);
      setIsLoading(false);
    }
    loadData();
  }, []);

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
