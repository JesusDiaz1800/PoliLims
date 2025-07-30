import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const activities = [
    { user: "Jesus Diaz", action: "Completó análisis para Muestra #HDPE-0821.", time: "Hace 5 min", avatar: { src: "https://placehold.co/40x40.png", fallback: "JD", hint: "man portrait" } },
    { user: "Antonia Figueroa", action: "Registró nuevo lote de accesorios PP-R Fusión Socket.", time: "Hace 24 min", avatar: { src: "https://placehold.co/40x40.png", fallback: "AF", hint: "woman portrait" } },
    { user: "Sistema", action: "Calibración de equipo GC-MS 01 vence en 10 días.", time: "Hace 1 hora", avatar: { src: "", fallback: "SYS", hint: "" } },
    { user: "Victor Lutz", action: "Aprobó informe para Lote #M-PRIM-5532.", time: "Hace 3 horas", avatar: { src: "https://placehold.co/40x40.png", fallback: "VL", hint: "man portrait" } },
    { user: "Maximiliano Miranda", action: "Inició flujo de trabajo para Materia Prima - TIO.", time: "Hace 8 horas", avatar: { src: "https://placehold.co/40x40.png", fallback: "MM", hint: "man glasses" } },
];

export function RecentActivityList() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Un registro de las acciones más recientes en el laboratorio.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activities.map((activity, index) => (
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
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
