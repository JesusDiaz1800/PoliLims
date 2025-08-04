
"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDynamicData, type Equipo } from "@/context/data-context";
import { isPast, differenceInDays, parse } from 'date-fns';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface EquipmentAlertsCardProps {
  equipos: Equipo[];
}

export function EquipmentAlertsCard({ equipos }: EquipmentAlertsCardProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const equiposConAlerta = React.useMemo(() => {
    if (!isClient) return [];
    return equipos.filter(equipo => {
      if (equipo.estado === 'En Mantenimiento' || equipo.estado === 'Requiere Calibración') {
        return true;
      }
      if (!equipo.proxima_calibracion) return false;
      const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
      return differenceInDays(calDate, new Date()) <= 30;
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

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <div>
            <CardTitle>Equipos que Requieren Atención</CardTitle>
            <CardDescription>Calibraciones próximas, vencidas o mantenimientos.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {equiposConAlerta.length > 0 ? (
              equiposConAlerta.map(equipo => {
                const alert = getAlertDetails(equipo);
                return (
                  <div key={equipo.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{equipo.nombre}</p>
                      <p className={cn("text-sm font-medium", alert.color)}>{alert.message}</p>
                    </div>
                    <Button variant="outline" size="sm">
                        Ver
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-muted-foreground pt-10">
                <p>¡Todo en orden!</p>
                <p>No hay equipos que requieran atención inmediata.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
