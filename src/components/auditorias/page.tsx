
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import * as dataService from "@/services/data-service";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { getAllUsers } from '@/services/user-service';

/**
 * @component AuditoriasPageInternal
 * @description Page component for managing audits. It fetches and displays a list of audits,
 * handles the creation and editing of audits through a dialog, and provides loading states.
 * This component was previously named AuditoriasPage but was renamed to avoid confusion with Next.js page routing.
 * It's now intended to be the internal logic component if needed, but the primary page is /app/(app)/auditorias/page.tsx.
 */
const AuditoriasPageInternal = () => {
  const [auditorias, setAuditorias] = React.useState<Auditoria[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  /**
   * @callback loadData
   * @description Fetches initial data for audits and users from their respective services.
   * It sets the loading state and updates the component's state with the fetched data.
   * Uses React.useCallback to prevent re-creation on every render.
   */
  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [initialData, allUsers] = await Promise.all([
        dataService.getInitialData(),
        getAllUsers()
      ]);
      setAuditorias(initialData.auditorias);
      // Filter users to only include relevant roles for auditing
      setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
    } catch (error) {
        console.error("Failed to load audit data:", error);
        // Optionally, set an error state to display a message to the user
    } finally {
        setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * @function handleOpenDialog
   * @description Opens the dialog for creating a new audit or editing an existing one.
   * @param {Auditoria} [auditoria] - The audit object to edit. If undefined, a new audit will be created.
   */
  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

  /**
   * @function handleCloseDialog
   * @description Closes the audit dialog and re-fetches the data to reflect any changes made.
   */
  const handleCloseDialog = () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
    loadData();
  };

  if (isLoading) {
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

export default AuditoriasPageInternal;
