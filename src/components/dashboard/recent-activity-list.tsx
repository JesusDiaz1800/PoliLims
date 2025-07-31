
"use client"

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DashboardFilters } from "@/app/(app)/dashboard/page";

const allActivities = [
    { user: "Jesus Diaz", action: "Completó análisis para Muestra #HDPE-0821.", time: "Hace 5 min", avatar: { src: "https://placehold.co/40x40.png", fallback: "JD", hint: "man portrait" }, analystId: "jesus.diaz" },
    { user: "Antonia Figueroa", action: "Registró nuevo lote de accesorios PP-R Fusión Socket.", time: "Hace 24 min", avatar: { src: "https://placehold.co/40x40.png", fallback: "AF", hint: "woman portrait" }, analystId: "antonia.figueroa" },
    { user: "Sistema", action: "Calibración de equipo GC-MS 01 vence en 10 días.", time: "Hace 1 hora", avatar: { src: "", fallback: "SYS", hint: "" }, analystId: "system" },
    { user: "Victor Lutz", action: "Aprobó informe para Lote #M-PRIM-5532.", time: "Hace 3 horas", avatar: { src: "https://placehold.co/40x40.png", fallback: "VL", hint: "man portrait" }, analystId: "victor.lutz"},
    { user: "Maximiliano Miranda", action: "Inició flujo de trabajo para Materia Prima - TIO.", time: "Hace 8 horas", avatar: { src: "https://placehold.co/40x40.png", fallback: "MM", hint: "man glasses" }, analystId: "maximiliano.miranda" },
];

interface RecentActivityListProps {
    filters: DashboardFilters;
}

export function RecentActivityList({ filters }: RecentActivityListProps) {
    const [activities, setActivities] = React.useState(allActivities);

    React.useEffect(() => {
        let filteredActivities = allActivities;
        if (filters.analyst !== 'all') {
            filteredActivities = allActivities.filter(activity => activity.analystId === filters.analyst);
        }
        // Add a bit of randomization to make it look like data is changing
        setActivities(filteredActivities.sort(() => Math.random() - 0.5).slice(0, 5));

    }, [filters]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Un registro de las acciones más recientes en el laboratorio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activities.length > 0 ? activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage src={activity.avatar.src} data-ai-hint={activity.avatar.hint} />
                                <AvatarFallback>{activity.avatar.fallback}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <span className="font-semibold text-foreground">{activity.user}</span> {activity.action}
                                </p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                        </div>
                    )) : <p className="text-sm text-muted-foreground text-center py-8">No hay actividad para el analista seleccionado.</p>}
                </div>
            </CardContent>
        </Card>
    );
}
