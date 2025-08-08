
"use client";

import * as React from 'react';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useSearchParams } from 'next/navigation';
import { findUserByUsername } from '@/services/user-service';

export default function TuberiasHdpePage() {
  const { ensayos, isLoading } = useDynamicData();
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState('all');

  React.useEffect(() => {
    const username = searchParams.get('user') || 'jdiaz';
    async function loadUser() {
      const userData = await findUserByUsername(username);
      setUser(userData);
    }
    loadUser();
  }, [searchParams]);

  const handleOpenFormDialog = (ensayo: Ensayo, filterType: string = 'all') => {
    setSelectedEnsayo(ensayo);
    setActiveTab(filterType);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setSelectedEnsayo(null);
    setIsFormDialogOpen(false);
  };
  
  const hdpeEnsayos = React.useMemo(() => 
    ensayos.filter(e => e.tipo === 'Tubería HDPE'), 
  [ensayos]);


  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <EnsayosProductoTerminadoTable
        ensayos={hdpeEnsayos}
        tipoEnsayo="HDPE"
        onOpenDialog={handleOpenFormDialog}
        user={user}
      />
      {selectedEnsayo && user && (
        <EnsayoProductoTerminadoDialog
          isOpen={isFormDialogOpen}
          onClose={handleCloseFormDialog}
          ensayo={selectedEnsayo}
          tipo="HDPE"
          user={user}
          defaultTab={activeTab}
        />
      )}
    </div>
  );
}
