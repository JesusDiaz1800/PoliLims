
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { ControlEventosTable } from '@/components/equipos/control-eventos-table';

export default function EquiposPage() {
  const { equipos, controles, isLoading } = useDynamicData();

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
