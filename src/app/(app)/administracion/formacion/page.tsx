
"use client";

import * as React from 'react';
import type { Formacion } from '@/context/data-context';
import * as userService from "@/services/user-service";
import * as dataService from "@/services/data-service";
import Loading from '@/app/(app)/loading';
import { FormacionTable } from '@/components/formacion/formacion-table';
import { FormacionDialog } from '@/components/formacion/formacion-dialog';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';

/**
 * @component FormacionPage
 * @description Page component for managing employee training and competency records.
 * It fetches all users and training data, displays it in a table, and handles
 * the creation and editing of records through a dialog.
 */
export default function FormacionPage() {
  const { formacion, isLoaded: isDataLoaded, addFormacion, updateFormacion } = useDynamicData();
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedFormacion, setSelectedFormacion] = React.useState<Formacion | null>(null);

  /**
   * @callback loadUsers
   * @description Fetches the list of all users from the user service.
   * This is used to populate selection dropdowns in the form.
   */
  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
    } catch(error) {
        console.error("Failed to load users for formacion page", error);
    } finally {
        setIsLoadingUsers(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenDialog = (record?: Formacion) => {
    setSelectedFormacion(record || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedFormacion(null);
    setIsDialogOpen(false);
  };

  if (!isDataLoaded || isLoadingUsers) {
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
