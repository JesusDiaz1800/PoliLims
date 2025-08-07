
"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, ChevronRight, CheckCircle, AlertTriangle, FlaskConical, CircleDot, FileCheck, FileX, Circle } from "lucide-react";
import { useDynamicData, type Ensayo } from "@/context/data-context";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from '../loading';

const workflowSteps = [
    { id: 'Recibida', label: 'Muestra Recibida', icon: Circle, statuses: ['Recibida'] },
    { id: 'En Análisis', label: 'En Análisis', icon: FlaskConical, statuses: ['En Progreso', 'En Análisis'] },
    { id: 'Pendiente de Revisión', label: 'Pendiente de Revisión', icon: CircleDot, statuses: ['Pendiente de Revisión'] },
    { id: 'Aprobado', label: 'Aprobado', icon: CheckCircle, statuses: ['Aprobado'] },
    { id: 'Rechazado', label: 'Rechazado', icon: AlertTriangle, statuses: ['Rechazado'] },
    { id: 'Archivada', label: 'Archivada', icon: FileCheck, statuses: ['Archivada'] },
];

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

export default function WorkflowsPage() {
    const { ensayos, isLoading } = useDynamicData();
    const [selectedEnsayoId, setSelectedEnsayoId] = React.useState<string | null>(null);

    const productEnsayos = React.useMemo(() => 
        ensayos.filter(e => e.tipo.startsWith('Tubería'))
    , [ensayos]);
    
    const selectedEnsayo = React.useMemo(() => 
        productEnsayos.find(e => e.id === selectedEnsayoId)
    , [productEnsayos, selectedEnsayoId]);
    
    const activeStepIndex = selectedEnsayo ? workflowSteps.findIndex(step => step.statuses.includes(selectedEnsayo.estado)) : -1;

    if (isLoading) {
        return <Loading/>;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 space-y-1.5">
                        <CardTitle>Flujos de Trabajo de Ensayos</CardTitle>
                        <CardDescription>Visualización interactiva del ciclo de vida de una muestra desde su recepción hasta la aprobación final.</CardDescription>
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
    );
}
