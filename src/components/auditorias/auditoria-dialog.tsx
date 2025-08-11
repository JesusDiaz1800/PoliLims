
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuditoriaForm } from "./auditoria-form";
import type { Auditoria, User } from "@/context/data-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditoriaChecklist } from "./auditoria-checklist";

interface AuditoriaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  auditoria: Auditoria | null;
  users: User[];
}

export function AuditoriaDialog({ isOpen, onClose, auditoria, users }: AuditoriaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{auditoria ? "Editar" : "Planificar"} Auditoría</DialogTitle>
          <DialogDescription>
            {auditoria
              ? `Gestionando la auditoría ${auditoria.id}. Use las pestañas para ver la planificación o ejecutar el checklist.`
              : "Complete el formulario para planificar una nueva auditoría."}
          </DialogDescription>
        </DialogHeader>
        
        {auditoria ? (
          <Tabs defaultValue="planificacion" className="flex-grow flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="planificacion">Planificación</TabsTrigger>
              <TabsTrigger value="checklist">Checklist ISO 17025</TabsTrigger>
            </TabsList>
            <TabsContent value="planificacion" className="flex-grow overflow-y-auto custom-scrollbar pt-4">
              <AuditoriaForm
                auditoriaToEdit={auditoria}
                onFormSubmit={onClose}
                users={users}
              />
            </TabsContent>
            <TabsContent value="checklist" className="flex-grow overflow-y-auto custom-scrollbar pt-4">
              <AuditoriaChecklist auditoria={auditoria} />
            </TabsContent>
          </Tabs>
        ) : (
           <div className="overflow-y-auto custom-scrollbar pt-4">
            <AuditoriaForm
                auditoriaToEdit={auditoria}
                onFormSubmit={onClose}
                users={users}
            />
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
