
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { MateriaPrimaTable } from '@/components/ensayos/materia-prima-table';
import { MateriaPrimaDialog } from '@/components/ensayos/materia-prima-dialog';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useSearchParams } from 'next/navigation';
import { findUserByUsername } from '@/services/user-service';
import * as dataService from "@/services/data-service";

export default function MateriaPrimaPage() {
  const [ensayos, setEnsayos] = React.useState<Ensayo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const searchParams = useSearchParams();
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

  React.useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const [userData, initialData] = await Promise.all([
            findUserByUsername(searchParams.get('user') || 'jdiaz'),
            dataService.getInitialData()
        ]);
        setUser(userData);
        setEnsayos(initialData.ensayos);
        setIsLoading(false);
    }
    loadData();
  }, [searchParams]);

  const handleOpenFormDialog = (ensayo?: Ensayo, filterType: string = 'all') => {
    setSelectedEnsayo(ensayo || null);
    setActiveTab(filterType);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setSelectedEnsayo(null);
    setIsFormDialogOpen(false);
  };

  if (isLoading || !user) {
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
