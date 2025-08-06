
"use client";

import * as React from 'react';
import { EnsayosProductoTerminadoTable } from '@/components/ensayos/tuberias/ensayos-producto-terminado-table';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { EnsayoProductoTerminadoDialog } from '@/components/ensayos/tuberias/ensayo-producto-terminado-dialog';
import { ApprovalDialog } from '@/components/ensayos/approval-dialog';
import type { Ensayo } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useSearchParams } from 'next/navigation';
import { findUserByUsername } from '@/services/user-service';

export default function TuberiasHdpePage() {
  const { ensayos, isLoading } = useDynamicData();
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Ensayo | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const username = searchParams.get('user') || 'jdiaz';
    async function loadUser() {
      const userData = await findUserByUsername(username);
      setUser(userData);
    }
    loadUser();
  }, [searchParams]);

  const handleOpenFormDialog = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setSelectedEnsayo(null);
    setIsFormDialogOpen(false);
  };

  const handleOpenApprovalDialog = (ensayo: Ensayo) => {
    setSelectedEnsayo(ensayo);
    setIsApprovalDialogOpen(true);
  }

  const handleCloseApprovalDialog = () => {
    setSelectedEnsayo(null);
    setIsApprovalDialogOpen(false);
  }

  if (isLoading || !user) {
    return <Loading />;
  }

  const hdpeEnsayos = ensayos.filter(e => e.tipo === 'Tubería HDPE');

  return (
    <div className="space-y-6">
      <EnsayosProductoTerminadoTable
        ensayos={hdpeEnsayos}
        tipoEnsayo="HDPE"
        onOpenDialog={handleOpenFormDialog}
        onApprove={handleOpenApprovalDialog}
        user={user}
      />
      {selectedEnsayo && user && (
        <EnsayoProductoTerminadoDialog
          isOpen={isFormDialogOpen}
          onClose={handleCloseFormDialog}
          ensayo={selectedEnsayo}
          tipo="HDPE"
          user={user}
        />
      )}
       {selectedEnsayo && user && (
        <ApprovalDialog
          isOpen={isApprovalDialogOpen}
          onClose={handleCloseApprovalDialog}
          ensayo={selectedEnsayo}
          user={user}
        />
      )}
    </div>
  );
}
