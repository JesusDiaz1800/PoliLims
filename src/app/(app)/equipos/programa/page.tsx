
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalendarioEquipos } from '@/components/equipos/calendario-equipos';
import { useDynamicData, type Equipo } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { parse, isPast } from 'date-fns';
import { EquipoDetailsDialog } from '@/components/equipos/equipo-details-dialog';
import { EquipoDialog } from '@/components/equipos/equipo-dialog';


export type CalendarioEvento = {
    title: string;
    start: Date;
    allDay: boolean;
    color: string;
    equipo: Equipo;
};

export default function ProgramaPage() {
    const { equipos, isLoading } = useDynamicData();
    const [eventos, setEventos] = React.useState<CalendarioEvento[]>([]);
    const [selectedEquipo, setSelectedEquipo] = React.useState<Equipo | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);

    React.useEffect(() => {
        if (!isLoading && equipos.length > 0) {
            const nuevosEventos = equipos.map(equipo => {
                if (!equipo.proxima_calibracion) return null;
                
                const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
                const color = isPast(calDate) ? '#ef4444' : '#f59e0b'; // red-500 or amber-500

                return {
                    title: `Calibrar: ${equipo.id}`,
                    start: calDate,
                    allDay: true,
                    color,
                    equipo: equipo,
                };
            }).filter((e): e is CalendarioEvento => e !== null);

            setEventos(nuevosEventos);
        }
    }, [equipos, isLoading]);

    const handleEventClick = (eventInfo: any) => {
        const equipoSeleccionado = eventInfo.event.extendedProps.equipo;
        setSelectedEquipo(equipoSeleccionado);
        setIsDetailsOpen(true);
    };

    const handleEdit = (equipo: Equipo) => {
        setSelectedEquipo(equipo);
        setIsDetailsOpen(false); // Close details dialog if open
        setIsEditOpen(true);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Programa de Calibración y Mantenimiento</CardTitle>
                    <CardDescription>
                        Calendario interactivo con las fechas de las próximas calibraciones y mantenimientos programados para los equipos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CalendarioEquipos eventos={eventos} onEventClick={handleEventClick} />
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

    