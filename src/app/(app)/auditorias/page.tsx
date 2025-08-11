
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import * as userService from "@/services/user-service";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';

const AuditoriasPageInternal = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true);
  
  const { auditorias, isLoaded: isAuditoriasLoaded } = useDynamicData();

  React.useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
      setIsLoadingUsers(false);
    };
    loadUsers();
  }, []);

  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

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

export default AuditoriasPageInternal;
