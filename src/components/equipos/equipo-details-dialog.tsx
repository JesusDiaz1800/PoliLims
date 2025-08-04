
"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Equipo } from "@/context/data-context";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";

interface EquipoDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  equipo: Equipo;
}

function getStatusVariant(status: Equipo["estado"]) {
  switch (status) {
    case "Activo":
      return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
    case "En Mantenimiento":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    case "Inactivo":
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    case "Requiere Calibración":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
    default:
      return "bg-secondary";
  }
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <h4 className="text-sm font-semibold text-muted-foreground">{label}</h4>
    <p className="text-base text-foreground">{value || "No especificado"}</p>
  </div>
);


export function EquipoDetailsDialog({ isOpen, onClose, onEdit, equipo }: EquipoDetailsDialogProps) {
  if (!equipo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{equipo.nombre}</DialogTitle>
          <DialogDescription>
            Detalles completos para el equipo con ID de activo: <span className="font-mono">{equipo.id}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <div className="md:col-span-1">
                 <div className="relative w-full h-64 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                    {equipo.fotoUrl ? (
                      <Image src={equipo.fotoUrl} alt={equipo.nombre} layout="fill" objectFit="contain" />
                    ) : (
                      <span className="text-sm text-muted-foreground">Sin fotografía</span>
                    )}
                  </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem label="ID de Activo" value={<span className="font-mono">{equipo.id}</span>} />
                <DetailItem label="Nombre del Equipo" value={equipo.nombre} />
                <DetailItem label="Marca" value={equipo.marca} />
                <DetailItem label="Modelo" value={equipo.modelo} />
                <DetailItem label="Ubicación" value={equipo.ubicacion} />
                <DetailItem label="Criticidad" value={equipo.criticidad} />
                <DetailItem label="Próxima Calibración" value={equipo.proxima_calibracion} />
                 <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">Estado</h4>
                    <Badge className={cn("mt-1 border-transparent font-normal text-base", getStatusVariant(equipo.estado))}>
                        {equipo.estado}
                    </Badge>
                </div>
                <div className="col-span-2">
                    <DetailItem label="Observaciones" value={equipo.observaciones || "Sin observaciones."} />
                </div>
            </div>
        </div>

        <Separator />
        
        {/* Placeholder for future sections */}
        <div className="py-4">
             <h3 className="text-lg font-semibold mb-2">Historial de Mantenimiento y Calibración</h3>
             <p className="text-sm text-muted-foreground text-center py-8 bg-muted rounded-md">
                Esta sección mostrará el historial completo de eventos del equipo. Próximamente.
             </p>
        </div>


        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Equipo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
