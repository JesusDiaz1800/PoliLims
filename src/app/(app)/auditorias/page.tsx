
"use client";

import * as React from 'react';
import { AuditoriasTable } from '@/components/auditorias/auditorias-table';
import { AuditoriaDialog } from '@/components/auditorias/auditoria-dialog';
import Loading from '../loading';
import type { Auditoria } from '@/context/data-context';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';
import { FilterProvider } from '@/context/filter-context';

/**
 * @component AuditoriasPage
 * @description Page component for managing audits. It consumes audit and user data from the central
 * data context, handles the creation and editing of audits through a dialog.
 */
function AuditoriasPageContent() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = React.useState<Auditoria | null>(null);
  
  const { auditorias, usuarios, isLoaded, deleteAuditoria } = useDynamicData();

  const relevantUsers = React.useMemo(() => 
    (usuarios || []).filter(u => u.role !== 'Cliente' && u.role !== 'Inspector de Calidad'),
  [usuarios]);

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
   * @description Closes the audit dialog.
   */
  const handleCloseDialog = () => {
    setSelectedAuditoria(null);
    setIsDialogOpen(false);
  };

  if (!isLoaded) {
    return <Loading />;
  }

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
        users={relevantUsers}
      />
    </div>
  );
}

export default function AuditoriasPage() {
    return (
        <FilterProvider>
            <AuditoriasPageContent />
        </FilterProvider>
    )
}
