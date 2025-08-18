
"use client";

import * as React from 'react';
import type { Capacitacion } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { CapacitacionesTable } from '@/components/capacitaciones/capacitaciones-table';
import { CapacitacionDialog } from '@/components/capacitaciones/capacitacion-dialog';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';
import { getAllUsers } from '@/services/user-service';

export default function CapacitacionesPage() {
  const { capacitaciones, isLoaded: isDataLoaded, deleteCapacitacion } = useDynamicData();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = React.useState<Capacitacion | null>(null);

  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
    } catch(error) {
        console.error("Failed to load users for capacitaciones page", error);
    } finally {
        setIsLoadingUsers(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenDialog = (record?: Capacitacion) => {
    setSelectedCapacitacion(record || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedCapacitacion(null);
    setIsDialogOpen(false);
  };

  if (!isDataLoaded || isLoadingUsers) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <CapacitacionesTable
        data={capacitaciones}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={deleteCapacitacion}
        users={users}
      />
      <CapacitacionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        capacitacion={selectedCapacitacion}
        users={users}
      />
    </div>
  );
}
