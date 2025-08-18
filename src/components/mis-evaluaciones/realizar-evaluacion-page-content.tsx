
"use client";

import * as React from 'react';
import { useDynamicData, type Capacitacion } from '@/context/data-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RealizarEvaluacionForm } from '@/components/capacitaciones/realizar-evaluacion-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function RealizarEvaluacionPageContent() {
    const { id: capacitacionId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { capacitaciones, user, updateCapacitacion } = useDynamicData();

    const capacitacion = React.useMemo(() => {
        if (!capacitacionId || !capacitaciones) return null;
        return capacitaciones.find(c => c.id === capacitacionId);
    }, [capacitacionId, capacitaciones]);

    const yaRespondio = React.useMemo(() => {
        if (!capacitacion || !user) return false;
        return capacitacion.evaluacion?.resultados?.some(r => r.empleadoId === user.username);
    }, [capacitacion, user]);

    const handleEvaluacionSubmit = async (respuestas: string[]) => {
        if (!capacitacion || !user || !capacitacion.evaluacion) return;

        // Aquí se podría añadir lógica de evaluación real (ej. comparar con respuestas correctas)
        const resultadoEvaluacion = 'Aprobado'; // Simulación

        const nuevoResultado = {
            empleadoId: user.username,
            respuestas,
            resultado: resultadoEvaluacion,
            fecha_completado: new Date().toISOString(),
        };
        
        const updatedEvaluacion = {
            ...capacitacion.evaluacion,
            resultados: [...(capacitacion.evaluacion.resultados || []), nuevoResultado]
        };

        try {
            await updateCapacitacion(capacitacion.id, { evaluacion: updatedEvaluacion });
            toast({
                title: "Evaluación Enviada",
                description: "Tus respuestas han sido registradas con éxito.",
            });
            router.push('/mis-evaluaciones');
        } catch(e) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: "No se pudieron guardar tus respuestas.",
            });
        }
    };

    if (!capacitacion) {
        return (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No se encontró la capacitación solicitada.
                </AlertDescription>
            </Alert>
        )
    }
    
    if (yaRespondio) {
        return (
            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Evaluación Completada</AlertTitle>
                <AlertDescription>
                    Ya has completado la evaluación para esta capacitación.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Evaluación: {capacitacion.nombre}</CardTitle>
                <CardDescription>
                    Por favor, responda las siguientes preguntas para completar su capacitación.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RealizarEvaluacionForm 
                    capacitacion={capacitacion}
                    onSubmit={handleEvaluacionSubmit}
                />
            </CardContent>
        </Card>
    );
}
