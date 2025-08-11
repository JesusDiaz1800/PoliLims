
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import * as userService from "@/services/user-service";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';

/**
 * @component AuditoriasPage
 * @description Page component for managing audits. It fetches audit and user data,
 * handles the creation and editing of audits through a dialog, and provides loading states.
 */
const AuditoriasPage = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
  
  const { auditorias, isLoaded: isAuditoriasLoaded } = useDynamicData();

  /**
   * @callback loadUsers
   * @description Fetches the list of users and filters them to include only relevant roles for auditing.
   */
  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
    } catch (error) {
        console.error("Failed to load users for audits", error);
    } finally {
        setIsLoadingUsers(false);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /**
   * @function handleOpenDialog
   * @description Opens the audit dialog. If an audit is passed, it opens in edit mode.
   * @param {Auditoria} [auditoria] - The audit object to edit.
   */
  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

  /**
   * @function handleCloseDialog
   * @description Closes the audit dialog. The table will refetch data via the context.
   */
  const handleCloseDialog = () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
  };

  if (!isAuditoriasLoaded || isLoadingUsers) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <AuditoriasTable
        auditorias={auditorias}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
      />
      <AuditoriaDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        auditoria={selectedAuditoria}
        users={users}
      />
    </div>
  );
}

export default AuditoriasPage;
