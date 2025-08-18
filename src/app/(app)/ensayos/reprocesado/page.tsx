
"use client";

import * as React from 'react';
import { ReprocesadoTable } from '@/components/ensayos/reprocesado-table';
import { ReprocesadoDialog } from '@/components/ensayos/reprocesado-dialog';
import type { Ensayo } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

function ReprocesadoPageContent() {
  const { ensayos, user } = useDynamicData();
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [activeTab, setActiveTab] = React.useState('all');

  const handleOpenFormDialog = (ensayo?: Ensayo, filterType: string = 'all') => {
    setSelectedEnsayo(ensayo || null);
    setActiveTab(filterType);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setSelectedEnsayo(null);
    setIsFormDialogOpen(false);
  };
  
  const reprocesadoEnsayos = React.useMemo(() => {
    return ensayos.filter(e => e.tipo === 'Reprocesado');
  },[ensayos]);

  const analistas = React.useMemo(() => [
      { value: "jesus.diaz", label: "Jesus Diaz" },
      { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
      { value: "antonia.figueroa", label: "Antonia Figueroa" },
      { value: "robinson.cordova", label: "Robinson Córdova" },
      { value: "bryan.vasquez", label: "Bryan Vásquez" },
  ], []);

  return (
    <div className="space-y-6">
      <ReprocesadoTable
        ensayos={reprocesadoEnsayos}
        onAddNew={() => handleOpenFormDialog()}
        onEdit={handleOpenFormDialog}
        user={user}
      />
      <ReprocesadoDialog
        isOpen={isFormDialogOpen}
        onClose={handleCloseFormDialog}
        ensayo={selectedEnsayo}
        analistas={analistas}
        defaultTab={activeTab}
      />
    </div>
  );
}

export default function ReprocesadoPage() {
    return (
        <FilterProvider>
            <ReprocesadoPageContent />
        </FilterProvider>
    )
}
