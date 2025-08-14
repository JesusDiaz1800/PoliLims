
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { ControlEventosTable } from '@/components/equipos/control-eventos-table';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

function ControlEquiposPageContent() {
  const { equipos, controles, isLoaded } = useDynamicData();

  if (!isLoaded) {
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

export default function ControlEquiposPage() {
    return (
        <FilterProvider>
            <ControlEquiposPageContent />
        </FilterProvider>
    )
}
