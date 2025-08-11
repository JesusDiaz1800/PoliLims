
"use client";

import * as React from 'react';
import type { Formacion } from '@/context/data-context';
import { useDynamicData } from '@/context/data-context';
import * as userService from "@/services/user-service";
import Loading from '@/app/(app)/loading';
import { FormacionTable } from '@/components/formacion/formacion-table';
import { FormacionDialog } from '@/components/formacion/formacion-dialog';
import type { User } from '@/services/user-service';

export default function FormacionPage() {
  const { formacion: initialFormacion, isLoading: isDynamicLoading } = useDynamicData();
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  
  const [formacion, setFormacion] = React.useState<Formacion[]>(initialFormacion);
  const [users, setUsers] = React.useState<User[]>([]);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedFormacion, setSelectedFormacion] = React.useState<Formacion | null>(null);

  React.useEffect(() => {
    async function loadData() {
        if (!isDynamicLoading) {
            const allUsers = await userService.getAllUsers();
            setFormacion(initialFormacion);
            setUsers(allUsers);
            setIsDataLoading(false);
        }
    }
    loadData();
  }, [isDynamicLoading, initialFormacion]);

  const handleOpenDialog = (record?: Formacion) => {
    setSelectedFormacion(record || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFormacion(null);
    setIsDialogOpen(false);
  };

  if (isDataLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <FormacionTable
        data={formacion}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <FormacionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        record={selectedFormacion}
        users={users}
      />
    </div>
  );
}
