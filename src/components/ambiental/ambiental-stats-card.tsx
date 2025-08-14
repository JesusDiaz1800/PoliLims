
"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { CondicionAmbiental } from "@/context/data-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";


interface AmbientalStatsCardProps {
  zona: string;
  ultimaLectura?: CondicionAmbiental;
  limites?: { temp: { min: number; max: number }; hum: { min: number; max: number } };
}

const StatItem = ({ icon, value, unit, isOutOfRange }: { icon: React.ReactNode, value: string, unit: string, isOutOfRange: boolean }) => (
    <div className={cn("flex items-center gap-2 p-2 rounded-md", isOutOfRange ? "bg-red-500/10" : "")}>
        <div className={cn("flex items-center gap-1", isOutOfRange ? "text-red-500" : "text-muted-foreground")}>
            {icon}
        </div>
        <div className="flex-1 text-right">
            <span className="font-bold text-lg font-headline">{value}</span>
            <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </div>
    </div>
);

export function AmbientalStatsCard({ zona, ultimaLectura, limites }: AmbientalStatsCardProps) {
  const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    // This effect runs only on the client, after hydration.
    // This ensures the server and client render match initially.
    if (ultimaLectura?.timestamp) {
        setFormattedDate(format(new Date(ultimaLectura.timestamp), 'dd/MM/yy HH:mm', { locale: es }));
    }
  }, [ultimaLectura]);

  if (!ultimaLectura || !limites) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">{zona}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin datos</p>
        </CardContent>
      </Card>
    );
  }
  
  const tempOutOfRange = ultimaLectura.temperatura < limites.temp.min || ultimaLectura.temperatura > limites.temp.max;
  const humOutOfRange = ultimaLectura.humedad < limites.hum.min || ultimaLectura.humedad > limites.hum.max;
  const isOk = !tempOutOfRange && !humOutOfRange;

  return (
    <Card className={cn("flex flex-col", isOk ? "" : "border-destructive/50")}>
        <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-medium">{zona}</CardTitle>
            {isOk ? <CheckCircle2 className="h-5 w-5 text-green-500"/> : <AlertTriangle className="h-5 w-5 text-destructive"/>}
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-grow">
            <div className="space-y-1">
                <StatItem icon={<Thermometer size={16} />} value={ultimaLectura.temperatura.toFixed(1)} unit="°C" isOutOfRange={tempOutOfRange}/>
                <StatItem icon={<Droplets size={16} />} value={ultimaLectura.humedad.toFixed(1)} unit="%" isOutOfRange={humOutOfRange}/>
            </div>
            <p className="text-xs text-muted-foreground text-right mt-2">
                {formattedDate ? `Última lectura: ${formattedDate}` : 'Cargando fecha...'}
            </p>
        </CardContent>
    </Card>
  );
}
