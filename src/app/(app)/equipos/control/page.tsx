
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { ControlEventosTable } from '@/components/equipos/control-eventos-table';
import * as dataService from "@/services/data-service";
import type { Equipo, ControlEvento } from '@/context/data-context';


export default function EquiposPage() {
  const [equipos, setEquipos] = React.useState<Equipo[]>([]);
  const [controles, setControles] = React.useState<ControlEvento[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await dataService.getInitialData();
      setEquipos(data.equipos);
      setControles(data.controles);
      setIsLoading(false);
    }
    loadData();
  }, []);


  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="space-y-6">
        <ControlEventosTable 
            controles={controles} 
            equipos={equipos}
        />
    </div>
  );
}
