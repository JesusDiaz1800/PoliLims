
"use client";

import * as React from 'react';
import Loading from '@/app/(app)/loading';
import { ReprocesadoTable } from '@/components/ensayos/reprocesado-table';
import { ReprocesadoDialog } from '@/components/ensayos/reprocesado-dialog';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useSearchParams } from 'next/navigation';
import { findUserByUsername } from '@/services/user-service';
import * as dataService from "@/services/data-service";

export default function ReprocesadoPage() {
  const [ensayos, setEnsayos] = React.useState<Ensayo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState('all');

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

  if (isLoading || !user) {
    return <Loading />;
  }
  
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
