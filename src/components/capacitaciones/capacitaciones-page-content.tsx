
"use client";

import * as React from 'react';
import type { Capacitacion, User } from '@/context/data-context';
import { CapacitacionesTable } from '@/components/capacitaciones/capacitaciones-table';
import { CapacitacionDialog } from '@/components/capacitaciones/capacitacion-dialog';
import { AsistenciaDialog } from '@/components/capacitaciones/asistencia-dialog';
import { EvaluacionDialog } from '@/components/capacitaciones/evaluacion-dialog';
import { useDynamicData } from '@/context/data-context';

export default function CapacitacionesPageContent() {
  const { capacitaciones, usuarios, deleteCapacitacion, updateCapacitacion } = useDynamicData();
  
  const [isCapacitacionDialogOpen, setIsCapacitacionDialogOpen] = React.useState(false);
  const [isAsistenciaDialogOpen, setIsAsistenciaDialogOpen] = React.useState(false);
  const [isEvaluacionDialogOpen, setIsEvaluacionDialogOpen] = React.useState(false);

  const [selectedCapacitacion, setSelectedCapacitacion] = React.useState<Capacitacion | null>(null);

  const handleOpenDialog = (type: 'capacitacion' | 'asistencia' | 'evaluacion', record?: Capacitacion) => {
    setSelectedCapacitacion(record || null);
    if (type === 'capacitacion') setIsCapacitacionDialogOpen(true);
    if (type === 'asistencia') setIsAsistenciaDialogOpen(true);
    if (type === 'evaluacion') setIsEvaluacionDialogOpen(true);
  };

  const handleCloseDialogs = () => {
    setSelectedCapacitacion(null);
    setIsCapacitacionDialogOpen(false);
    setIsAsistenciaDialogOpen(false);
    setIsEvaluacionDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <CapacitacionesTable
        data={capacitaciones}
        onAddNew={() => handleOpenDialog('capacitacion')}
        onEdit={(record) => handleOpenDialog('capacitacion', record)}
        onDelete={deleteCapacitacion}
        onManageAsistencia={(record) => handleOpenDialog('asistencia', record)}
        onManageEvaluacion={(record) => handleOpenDialog('evaluacion', record)}
        users={usuarios}
      />
      <CapacitacionDialog
        isOpen={isCapacitacionDialogOpen}
        onClose={handleCloseDialogs}
        capacitacion={selectedCapacitacion}
        users={usuarios}
      />
      {selectedCapacitacion && (
        <>
          <AsistenciaDialog
            isOpen={isAsistenciaDialogOpen}
            onClose={handleCloseDialogs}
            capacitacion={selectedCapacitacion}
            users={usuarios}
            onSave={updateCapacitacion}
          />
          <EvaluacionDialog
            isOpen={isEvaluacionDialogOpen}
            onClose={handleCloseDialogs}
            capacitacion={selectedCapacitacion}
            onSave={updateCapacitacion}
          />
        </>
      )}
    </div>
  );
}
