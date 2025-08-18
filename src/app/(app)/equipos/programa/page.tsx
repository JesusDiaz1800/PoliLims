
"use client";

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { parse, isPast } from 'date-fns';
import { EquipoDetailsDialog } from '@/components/equipos/equipo-details-dialog';
import { EquipoDialog } from '@/components/equipos/equipo-dialog';
import { useDynamicData, type Equipo } from '@/context/data-context';
import { ModernCalendar } from '@/components/equipos/modern-calendar';

export type CalendarioEvento = {
    title: string;
    start: Date;
    allDay: boolean;
    color: string;
    equipo: Equipo;
};

export default function ProgramaPage() {
    const { equipos } = useDynamicData();
    const [eventos, setEventos] = React.useState<CalendarioEvento[]>([]);
    const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    React.useEffect(() => {
        if (equipos.length > 0) {
            const nuevosEventos = equipos.map(equipo => {
                if (!equipo.proxima_calibracion) return null;
                
                try {
                    const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
                     if (isNaN(calDate.getTime())) {
                        console.warn(`Invalid date format for equipo ${equipo.id}: ${equipo.proxima_calibracion}`);
                        return null;
                    }
                    const color = isPast(calDate) ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';

                    return {
                        title: `Calibrar: ${equipo.nombre} (${equipo.id})`,
                        start: calDate,
                        allDay: true,
                        color,
                        equipo: equipo,
                    };
                } catch (error) {
                    console.error(`Error parsing date for equipo ${equipo.id}: ${equipo.proxima_calibracion}`, error);
                    return null;
                }
            }).filter((e): e is CalendarioEvento => e !== null);

            setEventos(nuevosEventos);
        }
    }, [equipos]);
    
    const handleEventClick = (evento: CalendarioEvento) => {
        setSelectedEquipo(evento.equipo);
        setIsDetailsOpen(true);
    };

    const handleEdit = (equipo: Equipo) => {
        setSelectedEquipo(equipo);
        setIsDetailsOpen(false); // Close details dialog if open
        setIsEditOpen(true);
    }

    return (
        <>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <ModernCalendar events={eventos} onEventClick={handleEventClick}/>
                </CardContent>
            </Card>

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
