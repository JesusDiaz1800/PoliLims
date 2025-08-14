
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, ChevronRight, CheckCircle, AlertTriangle, FlaskConical, CircleDot, FileCheck, Circle, Info } from "lucide-react";
import type { Ensayo, RecentActivity } from "@/context/data-context";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from '../loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDynamicData } from '@/context/data-context';

const workflowSteps = [
    { id: 'Recibida', label: 'Muestra Recibida', icon: Circle, statuses: ['Recibida'] },
    { id: 'En Análisis', label: 'En Análisis', icon: FlaskConical, statuses: ['En Progreso', 'En Análisis'] },
    { id: 'Pendiente de Revisión', label: 'Pendiente de Revisión', icon: CircleDot, statuses: ['Pendiente de Revisión'] },
    { id: 'Aprobado', label: 'Aprobado', icon: CheckCircle, statuses: ['Aprobado'] },
    { id: 'Rechazado', label: 'Rechazado', icon: AlertTriangle, statuses: ['Rechazado'] },
    { id: 'Archivada', label: 'Archivada', icon: FileCheck, statuses: ['Archivada'] },
];

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

const Step = ({ icon: Icon, label, isActive, isCompleted }: { icon: React.ElementType, label: string, isActive: boolean, isCompleted: boolean }) => {
    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border-2",
                isActive ? "bg-primary border-primary text-primary-foreground" : 
                isCompleted ? "bg-secondary border-secondary-foreground text-secondary-foreground" :
                "bg-muted border-muted-foreground/30 text-muted-foreground"
            )}>
                <Icon className="h-6 w-6" />
            </div>
            <p className={cn(
                "mt-2 text-sm text-center font-medium",
                 isActive ? "text-primary" : "text-muted-foreground"
            )}>{label}</p>
        </div>
    );
};

const HistoryItem = ({ activity }: { activity: RecentActivity }) => {
    const avatar = getAvatarInfo(activity.user);
    const [formattedDate, setFormattedDate] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (activity.timestamp) {
            setFormattedDate(format(parseISO(activity.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es }));
        }
    }, [activity.timestamp]);

    return (
        <div className="flex items-start gap-4">
            <Avatar>
                <AvatarImage src={avatar.src} data-ai-hint={avatar.hint} />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold text-foreground">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formattedDate || 'Cargando fecha...'}
                </p>
            </div>
        </div>
    );
}


export default function WorkflowsPage() {
    const { ensayos, recentActivity, isLoaded } = useDynamicData();
    const [selectedEnsayoId, setSelectedEnsayoId] = React.useState<string | null>(null);

    const productEnsayos = React.useMemo(() => 
        ensayos.filter(e => e.tipo.startsWith('Tubería'))
    , [ensayos]);
    
    const selectedEnsayo = React.useMemo(() => 
        productEnsayos.find(e => e.id === selectedEnsayoId)
    , [productEnsayos, selectedEnsayoId]);
    
    const activeStepIndex = selectedEnsayo ? workflowSteps.findIndex(step => step.statuses.includes(selectedEnsayo.estado)) : -1;
    
    const sampleHistory = React.useMemo(() => {
        if (!selectedEnsayo) return [];
        return recentActivity
            .filter(act => act.action.includes(selectedEnsayo.id) || (selectedEnsayo.lote && act.action.includes(selectedEnsayo.lote)))
            .sort((a,b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    }, [selectedEnsayo, recentActivity]);

    if (!isLoaded) {
        return <Loading/>;
    }

    return (
        <div className="space-y-6">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Seleccione un Ensayo</AlertTitle>
                <AlertDescription>
                    Utilice el selector a continuación para elegir un ensayo de producto terminado. Se mostrará su estado actual en el flujo de trabajo del laboratorio y su historial de auditoría completo.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex-1 space-y-1.5">
                            <CardTitle>Estado del Flujo de Trabajo</CardTitle>
                            <CardDescription>Visualización del ciclo de vida de una muestra desde su recepción hasta la aprobación final.</CardDescription>
                        </div>
                        <div className="w-full md:w-auto md:min-w-[400px]">
                        <Select onValueChange={setSelectedEnsayoId} value={selectedEnsayoId || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un ensayo para ver su flujo..." />
                            </SelectTrigger>
                            <SelectContent>
                                {productEnsayos.map((ensayo) => (
                                <SelectItem key={ensayo.id} value={ensayo.id}>
                                    {`${ensayo.id} - ${ensayo.producto}`}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedEnsayo ? (
                        <div className="flex items-center justify-between py-8">
                            {workflowSteps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <Step
                                        icon={step.icon}
                                        label={step.label}
                                        isActive={index === activeStepIndex}
                                        isCompleted={index < activeStepIndex}
                                    />
                                    {index < workflowSteps.length - 1 && (
                                        <ChevronRight className="h-8 w-8 text-muted-foreground/30 mx-4" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center border-dashed border-2 rounded-lg">
                            <GitBranch className="w-16 h-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold font-headline">Seleccione un Ensayo</h3>
                            <p className="text-muted-foreground mt-2">Elija un ensayo de la lista para visualizar su estado en el flujo de trabajo.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedEnsayo && (
                <Card className="animate-in fade-in">
                    <CardHeader>
                        <CardTitle>Historial de la Muestra (Audit Trail)</CardTitle>
                        <CardDescription>Registro cronológico de todas las acciones realizadas sobre el ensayo <span className="font-mono font-bold text-foreground">{selectedEnsayo.id}</span>.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-6">
                           {sampleHistory.length > 0 ? (
                               sampleHistory.map(activity => <HistoryItem key={activity.id} activity={activity} />)
                           ) : (
                                <p className="text-muted-foreground text-center py-4">No hay historial de actividad para esta muestra.</p>
                           )}
                       </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
