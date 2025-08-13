
"use client"

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RecentActivity } from "@/context/data-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { parseISO } from "date-fns";

const getAvatarInfo = (name: string) => {
    const fallback = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const hints: { [key: string]: string } = {
        "Jesus Diaz": "man portrait",
        "Antonia Figueroa": "woman portrait",
        "Victor Lutz": "man portrait",
        "Maximiliano Miranda": "man glasses",
        "Bryan Vásquez": "man portrait",
        "Robinson Córdova": "man portrait",
        "Elias Ibañez": "man portrait",
        "Cristian Montellano": "man portrait",
        "Daniel Palma": "man portrait",
        "Luis Parada": "man portrait",
    }
    return {
        fallback,
        src: `https://placehold.co/40x40.png`,
        hint: hints[name] || "person",
    }
}

interface RecentActivityListProps {
    initialActivity: RecentActivity[];
}

const RecentActivityListInternal = ({ initialActivity }: RecentActivityListProps) => {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const activityList = initialActivity || [];

    return (
        <>
            <CardHeader className="p-4 pb-0">
                <CardTitle className="text-base">Actividad Reciente</CardTitle>
                <CardDescription className="text-sm">Registro de las últimas acciones.</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] pb-2">
                <ScrollArea className="h-full pr-2">
                    <div className="space-y-4">
                        {activityList.length > 0 ? activityList.map((activity) => {
                            const avatar = getAvatarInfo(activity.user);
                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={avatar.src} data-ai-hint={avatar.hint} />
                                        <AvatarFallback>{avatar.fallback}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-xs">
                                            <span className="font-semibold text-foreground">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isClient ? format(parseISO(activity.timestamp), "dd/MM/yy HH:mm", { locale: es }) : '...'}
                                        </p>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-xs text-muted-foreground text-center py-8">No hay actividad reciente.</p>}
                    </div>
                </ScrollArea>
            </CardContent>
        </>
    );
}

export const RecentActivityList = React.memo(RecentActivityListInternal);
