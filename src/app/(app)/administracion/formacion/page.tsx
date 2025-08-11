
"use client";

import * as React from 'react';
import type { Formacion } from '@/context/data-context';
import * as userService from "@/services/user-service";
import * as dataService from "@/services/data-service";
import Loading from '@/app/(app)/loading';
import { FormacionTable } from '@/components/formacion/formacion-table';
import { FormacionDialog } from '@/components/formacion/formacion-dialog';
import type { User } from '@/services/user-service';

export default function FormacionPage() {
  const [formacion, setFormacion] = React.useState<Formacion[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedFormacion, setSelectedFormacion] = React.useState<Formacion | null>(null);

  React.useEffect(() => {
    async function loadData() {
        setIsLoading(true);
        const [initialData, allUsers] = await Promise.all([
            dataService.getInitialData(),
            userService.getAllUsers()
        ]);
        setFormacion(initialData.formacion);
        setUsers(allUsers);
        setIsLoading(false);
    }
    loadData();
  }, []);

  const handleOpenDialog = (record?: Formacion) => {
    setSelectedFormacion(record || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    setSelectedFormacion(null);
    setIsDialogOpen(false);
    // Re-fetch data to reflect changes
    setIsLoading(true);
    const initialData = await dataService.getInitialData();
    setFormacion(initialData.formacion);
    setIsLoading(false);
  };

  if (isLoading) {
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
