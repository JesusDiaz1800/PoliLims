"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { MateriaPrimaTable } from '@/components/ensayos/materia-prima-table';
import { MateriaPrimaDialog } from '@/components/ensayos/materia-prima-dialog';
import type { Ensayo } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

function MateriaPrimaPageContent() {
  const { ensayos, user, isLoaded } = useDynamicData();
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [activeTab, setActiveTab] = React.useState('all');

  const materiaPrimaEnsayos = React.useMemo(() => {
    return ensayos.filter(e => e.tipo === 'Materia Prima');
  }, [ensayos]);

  const analistas = React.useMemo(() => [
      { value: "jesus.diaz", label: "Jesus Diaz" },
      { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
      { value: "antonia.figueroa", label: "Antonia Figueroa" },
      { value: "robinson.cordova", label: "Robinson Córdova" },
      { value: "bryan.vasquez", label: "Bryan Vásquez" },
  ], []);

  const handleOpenFormDialog = (ensayo?: Ensayo, filterType: string = 'all') => {
    setSelectedEnsayo(ensayo || null);
    setActiveTab(filterType);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setSelectedEnsayo(null);
    setIsFormDialogOpen(false);
  };

  if (!isLoaded || !user) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <MateriaPrimaTable
        ensayos={materiaPrimaEnsayos}
        onAddNew={() => handleOpenFormDialog()}
        onEdit={handleOpenFormDialog}
        user={user}
      />
      <MateriaPrimaDialog
        isOpen={isFormDialogOpen}
        onClose={handleCloseFormDialog}
        ensayo={selectedEnsayo}
        analistas={analistas}
        defaultTab={activeTab}
      />
    </div>
  );
}

export default function MateriaPrimaPage() {
    return (
        <FilterProvider>
            <MateriaPrimaPageContent />
        </FilterProvider>
    )
}
