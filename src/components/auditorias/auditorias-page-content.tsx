"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import { useDynamicData } from "@/context/data-context";
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { getAllUsers } from '@/services/user-service';

export default function AuditoriasPageContent() {
  const { auditorias, deleteAuditoria } = useDynamicData();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  const [users, setUsers] = React.useState<User[]>([]);

  const loadUsers = React.useCallback(async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers.filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'));
    } catch (error) {
        console.error("Failed to load users for audit page:", error);
    }
  }, []);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleOpenDialog = (auditoria?: Auditoria) => {
    setSelectedAuditoria(auditoria || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <AuditoriasTable
        auditorias={auditorias}
        onAddNew={() => handleOpenDialog()}
        onEdit={handleOpenDialog}
        onDelete={deleteAuditoria}
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
