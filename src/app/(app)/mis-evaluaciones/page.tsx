
"use client";

import * as React from 'react';
import { useDynamicData, type Capacitacion } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserCheck, HelpCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function MisEvaluacionesPage() {
    const { capacitaciones, user, isLoaded } = useDynamicData();

    const misEvaluacionesPendientes = React.useMemo(() => {
        if (!user || !capacitaciones) return [];
        return capacitaciones.filter(cap => {
            const haAsistido = cap.asistentes?.some(a => a.empleadoId === user.username && a.asistio);
            const tieneEvaluacion = cap.evaluacion && cap.evaluacion.preguntas && cap.evaluacion.preguntas.length > 0;
            if (!haAsistido || !tieneEvaluacion) return false;

            const yaRespondio = cap.evaluacion.resultados?.some(r => r.empleadoId === user.username);
            return !yaRespondio;
        });
    }, [capacitaciones, user]);

    if (!isLoaded || !user) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <UserCheck className="h-8 w-8 text-primary"/>
                        <div>
                            <CardTitle>Mis Evaluaciones Pendientes</CardTitle>
                            <CardDescription>
                                Aquí encontrarás las evaluaciones de las capacitaciones a las que has asistido y que aún no has completado.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {misEvaluacionesPendientes.length === 0 ? (
                <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertTitle>¡Todo al día!</AlertTitle>
                    <AlertDescription>
                        No tienes evaluaciones pendientes por el momento.
                    </AlertDescription>
                </Alert>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {misEvaluacionesPendientes.map(cap => (
                        <Card key={cap.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{cap.nombre}</CardTitle>
                                <CardDescription>Realizada el {format(parseISO(cap.fecha), "dd 'de' MMMM, yyyy", { locale: es })}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Esta evaluación está pendiente. Por favor, complétala para finalizar tu registro de capacitación.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/mis-evaluaciones/${cap.id}?user=${user.username}`}>
                                        Comenzar Evaluación
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

