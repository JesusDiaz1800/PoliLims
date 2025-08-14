
"use client";

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Clock, AlertTriangle, Info, Wrench } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDynamicData } from '@/context/data-context';
import Link from 'next/link';
import { isPast, parse, differenceInDays, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '../ui/scroll-area';

interface Notification {
    id: string;
    type: 'alert' | 'info' | 'task';
    icon: React.ElementType;
    title: string;
    description: string;
    timestamp: string;
    href: string;
}

const NotificationItem = ({ notification, onNotificationClick }: { notification: Notification; onNotificationClick: () => void; }) => (
    <Link href={notification.href} onClick={onNotificationClick} className="block hover:bg-muted/50 p-3 rounded-lg transition-colors">
        <div className="flex items-start gap-3">
            <notification.icon className="h-5 w-5 mt-1 text-primary"/>
            <div className="flex-1">
                <p className="font-semibold text-sm">{notification.title}</p>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{notification.timestamp}</p>
            </div>
        </div>
    </Link>
);

export function NotificationDropdown() {
    const { equipos, ensayos, user } = useDynamicData();
    const [isOpen, setIsOpen] = React.useState(false);

    const calibrationAlerts = React.useMemo(() => {
        if (!equipos) return [];
        return equipos
            .map(equipo => {
                if (!equipo.proxima_calibracion) return null;
                try {
                    const calDate = parse(equipo.proxima_calibracion, 'dd-MM-yyyy', new Date());
                    const daysUntil = differenceInDays(calDate, new Date());
                    if (daysUntil <= 30) {
                         return {
                            id: `cal-${equipo.id}`,
                            type: 'alert' as const,
                            icon: Wrench,
                            title: `Calibración Próxima: ${equipo.nombre}`,
                            description: `Vence en ${daysUntil} día(s).`,
                            timestamp: formatDistanceToNow(calDate, { addSuffix: true, locale: es }),
                            href: `/equipos/programa?id=${equipo.id}`
                        };
                    }
                } catch { return null; }
                return null;
            })
            .filter((item): item is Notification => item !== null)
            .sort((a,b) => parse(a.description, "'Vence en 'd' día(s).'", new Date()).getTime() - parse(b.description, "'Vence en 'd' día(s).'", new Date()).getTime());
    }, [equipos]);
    
    const pendingTasks = React.useMemo(() => {
        if(!ensayos || user?.role === 'Inspector de Calidad' || user?.role === 'Analista de Calidad') return [];
        return ensayos
            .filter(e => e.estado === 'Pendiente de Revisión')
            .map(e => ({
                 id: `task-${e.id}`,
                 type: 'task' as const,
                 icon: Clock,
                 title: `Ensayo Pendiente: ${e.id}`,
                 description: `El ensayo para "${e.producto}" requiere tu aprobación.`,
                 timestamp: formatDistanceToNow(parse(e.fecha, 'dd-MM-yyyy', new Date()), { addSuffix: true, locale: es }),
                 href: `/ensayos/seguimiento?id=${e.id}`
            }));
    }, [ensayos, user]);
    
    const totalNotifications = calibrationAlerts.length + pendingTasks.length;

    const handleNotificationClick = () => {
        setIsOpen(false);
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {totalNotifications > 0 && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </span>
                    )}
                    <span className="sr-only">Notificaciones</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 mr-4" align="end">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">Todas ({totalNotifications})</TabsTrigger>
                        <TabsTrigger value="alerts">Alertas ({calibrationAlerts.length})</TabsTrigger>
                        <TabsTrigger value="tasks">Tareas ({pendingTasks.length})</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-80 mt-2">
                        <TabsContent value="all">
                           {(calibrationAlerts.length > 0 || pendingTasks.length > 0) ? (
                                <>
                                    {pendingTasks.map(n => <NotificationItem key={n.id} notification={n} onNotificationClick={handleNotificationClick} />)}
                                    {calibrationAlerts.map(n => <NotificationItem key={n.id} notification={n} onNotificationClick={handleNotificationClick} />)}
                                </>
                            ) : (
                                <div className="text-center text-sm text-muted-foreground p-8">No hay notificaciones nuevas.</div>
                            )}
                        </TabsContent>
                        <TabsContent value="alerts">
                             {calibrationAlerts.length > 0 ? (
                                calibrationAlerts.map(n => <NotificationItem key={n.id} notification={n} onNotificationClick={handleNotificationClick}/>)
                             ) : (
                                <div className="text-center text-sm text-muted-foreground p-8">No hay alertas.</div>
                             )}
                        </TabsContent>
                         <TabsContent value="tasks">
                             {pendingTasks.length > 0 ? (
                                pendingTasks.map(n => <NotificationItem key={n.id} notification={n} onNotificationClick={handleNotificationClick}/>)
                             ) : (
                                <div className="text-center text-sm text-muted-foreground p-8">No tienes tareas pendientes.</div>
                             )}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
                <div className="mt-2 border-t pt-2">
                    <Button variant="ghost" className="w-full justify-center" asChild>
                        <Link href="/administracion/notificaciones">Ver todas y configurar</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}


    