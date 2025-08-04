
"use client"

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDynamicData } from "@/context/data-context";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { RecentActivity } from "@/context/data-context";

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

export function RecentActivityList({ initialActivity }: RecentActivityListProps) {
    const { recentActivity: dynamicActivity } = useDynamicData();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const activityList = dynamicActivity.length > 0 ? dynamicActivity : initialActivity;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Un registro de las acciones más recientes.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-6">
                        {activityList.length > 0 ? activityList.map((activity) => {
                            const avatar = getAvatarInfo(activity.user);
                            return (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={avatar.src} data-ai-hint={avatar.hint} />
                                        <AvatarFallback>{avatar.fallback}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-semibold text-foreground">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isClient ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: es }) : '...'}
                                        </p>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-sm text-muted-foreground text-center py-8">No hay actividad reciente.</p>}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
