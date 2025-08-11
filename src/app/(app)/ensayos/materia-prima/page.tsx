
"use client";

import * as React from 'react';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { MateriaPrimaTable } from '@/components/ensayos/materia-prima-table';
import { MateriaPrimaDialog } from '@/components/ensayos/materia-prima-dialog';
import type { Test } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useSearchParams } from 'next/navigation';
import { findUserByUsername } from '@/services/user-service';

export default function MateriaPrimaPage() {
  const { tests, isLoading } = useDynamicData();
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [selectedEnsayo, setSelectedEnsayo] = React.useState<Test | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = React.useState('all');

  const materiaPrimaEnsayos = React.useMemo(() => {
    if (!tests) return [];
    return tests.filter(e => e.type === 'Materia Prima');
  }, [tests]);

  const analistas = React.useMemo(() => [
      { value: "jesus.diaz", label: "Jesus Diaz" },
      { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
      { value: "antonia.figueroa", label: "Antonia Figueroa" },
      { value: "robinson.cordova", label: "Robinson Córdova" },
      { value: "bryan.vasquez", label: "Bryan Vásquez" },
  ], []);

  React.useEffect(() => {
    const username = searchParams.get('user') || 'jdiaz';
    async function loadUser() {
      const userData = await findUserByUsername(username);
      setUser(userData);
    }
    loadUser();
  }, [searchParams]);

  const handleOpenFormDialog = (ensayo?: Test, filterType: string = 'all') => {
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
