
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import * as dataService from "@/services/data-service";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { getAllUsers } from '@/services/user-service';

const AuditoriasPageInternal = () => {
  const [auditorias, setAuditorias] = React.useState<Auditoria[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const [initialData, allUsers] = await Promise.all([
      dataService.getInitialData(),
      getAllUsers()
    ]);
    setAuditorias(initialData.auditorias);
    setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
    // Re-fetch data to reflect changes
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

