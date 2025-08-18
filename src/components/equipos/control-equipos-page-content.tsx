
"use client";

import * as React from 'react';
import { ControlEventosTable } from '@/components/equipos/control-eventos-table';
import { useDynamicData } from '@/context/data-context';

export default function ControlEquiposPageContent() {
  const { equipos, controles } = useDynamicData();

  return (
    <div className="space-y-6">
        <ControlEventosTable 
            controles={controles} 
            equipos={equipos}
        />
    </div>
  );
}
