
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import * as dataService from "@/services/data-service";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { getAllUsers } from '@/services/user-service';

export default function AuditoriasPage() {
  const [auditorias, setAuditorias] = React.useState<Auditoria[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [initialData, allUsers] = await Promise.all([
        dataService.getInitialData(),
        getAllUsers()
      ]);
      setAuditorias(initialData.auditorias);
      setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = async () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
    // Re-fetch data to reflect changes
    setIsLoading(true);
    const initialData = await dataService.getInitialData();
    setAuditorias(initialData.auditorias);
    setIsLoading(false);
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
