

"use client";

import * as React from "react";
import { AlertTriangle, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Equipo } from "@/context/data-context";
import { isPast, differenceInDays, parse } from 'date-fns';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { EquipoDetailsDialog } from "../equipos/equipo-details-dialog";
import { EquipoDialog } from "../equipos/equipo-dialog";


interface EquipmentAlertsCardProps {
  equipos: Equipo[];
}

const EquipmentAlertsCardInternal = ({ equipos }: EquipmentAlertsCardProps) => {
  const [isClient, setIsClient] = React.useState(false);
  const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const equiposConAlerta = React.useMemo(() => {
    if (!isClient || !equipos) return [];
    return equipos
        .filter(equipo => {
            if (equipo.estado === 'En Mantenimiento' || equipo.estado === 'Requiere Calibración') {
                return true;
            }
            if (!equipo.proxima_calibracion) return false;
            const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
            return differenceInDays(calDate, new Date()) <= 30;
        })
        .sort((a,b) => {
             const calDateA = a.proxima_calibracion ? parse(a.proxima_calibracion, 'dd-MM-yyyy', new Date()) : new Date(8640000000000000) ;
             const calDateB = b.proxima_calibracion ? parse(b.proxima_calibracion, 'dd-MM-yyyy', new Date()) : new Date(8640000000000000) ;
             return calDateA.getTime() - calDateB.getTime();
        });
  }, [equipos, isClient]);

  const getAlertDetails = (equipo: Equipo) => {
    if (equipo.estado === 'En Mantenimiento') {
      return { message: "En Mantenimiento", color: "text-yellow-600 dark:text-yellow-400" };
    }
     if (equipo.estado === 'Requiere Calibración') {
      return { message: "Calibración Vencida", color: "text-red-600 dark:text-red-400" };
    }
    const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
    const days = differenceInDays(calDate, new Date());
    return { message: `Calibración en ${days} días`, color: "text-orange-600 dark:text-orange-400" };
  };
  
  const handleViewDetails = (equipo: Equipo) => {
      setSelectedEquipo(equipo);
      setIsDetailsOpen(true);
  }

  const handleEdit = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setIsDetailsOpen(false); // Close details dialog if open
    setIsEditOpen(true);
  }

  return (
    <>
    <>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle className="text-lg">Alertas de Equipos</CardTitle>
            <CardDescription className="text-xs">Atención requerida.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-4.5rem)] pb-2">
        <ScrollArea className="h-full pr-2">
          <div className="space-y-3">
            {equiposConAlerta.length > 0 ? (
              equiposConAlerta.map(equipo => {
                const alert = getAlertDetails(equipo);
                return (
                  <div key={equipo.id} className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold">{equipo.nombre}</p>
                      <p className={cn("font-medium", alert.color)}>{alert.message}</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleViewDetails(equipo)}>
                        Ver
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs text-muted-foreground h-full flex items-center justify-center">
                <p>No hay equipos que requieran atención inmediata.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </>

    {selectedEquipo && (
        <EquipoDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          equipo={selectedEquipo}
          onEdit={() => handleEdit(selectedEquipo)}
        />
      )}
      {selectedEquipo && (
        <EquipoDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          equipo={selectedEquipo}
        />
      )}
    </>
  );
}
export const EquipmentAlertsCard = React.memo(EquipmentAlertsCardInternal);
