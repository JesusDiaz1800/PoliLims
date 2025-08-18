
"use client";

import * as React from 'react';
import { PhiTable } from '@/components/ensayos/phi/phi-table';
import { PhiDialogs } from '@/components/ensayos/phi/phi-dialogs';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { LogoAlt } from '@/components/logo-alt';
import { Button } from '@/components/ui/button';
import { FilePlus2, Edit, Timer, History } from 'lucide-react';
import { PhiStatusCard } from '@/components/ensayos/phi/phi-status-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ResistenciaPresionHidrostaticaPage() {
    const { ensayosPHI, addEnsayoPHI, updateEnsayoPHI, isLoaded } = useDynamicData();
    const [isNewEnsayoOpen, setIsNewEnsayoOpen] = React.useState(false);
    const [isResultOpen, setIsResultOpen] = React.useState(false);

    if (!isLoaded) {
        return <Loading />;
    }

    const ensayosActivos = ensayosPHI.filter(e => e.estado === 'EN PROCESO');
    const ensayosFinalizados = ensayosPHI.filter(e => e.estado === 'FINALIZADO');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start pb-4 border-b-2 border-primary print:hidden">
                <div className="w-48">
                    <LogoAlt />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold font-headline uppercase">Registro de Resistencia a la Presión Hidrostática</h1>
                    <p className="text-sm text-muted-foreground">LEP-DGC-021, Versión 01</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                    <Button onClick={() => setIsNewEnsayoOpen(true)}>
                        <FilePlus2 className="mr-2 h-4 w-4"/>
                        Iniciar Ensayo
                    </Button>
                    <Button variant="secondary" onClick={() => setIsResultOpen(true)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Ingresar Resultado
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Timer className="h-6 w-6 text-primary"/>
                        <div>
                            <CardTitle>Monitoreo en Tiempo Real</CardTitle>
                            <CardDescription>Visualización de los ensayos actualmente en proceso.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {ensayosActivos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ensayosActivos.map(ensayo => (
                                <PhiStatusCard key={ensayo.id} ensayo={ensayo} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                            <Timer className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold">No hay ensayos en proceso</h3>
                            <p>Inicie un nuevo ensayo para comenzar el monitoreo.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                     <div className="flex items-center gap-3">
                        <History className="h-6 w-6 text-primary"/>
                        <div>
                            <CardTitle>Historial de Ensayos Finalizados</CardTitle>
                            <CardDescription>Registro de todos los ensayos de PHI completados.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PhiTable data={ensayosFinalizados} />
                </CardContent>
            </Card>
            
            <PhiDialogs
                isNewEnsayoOpen={isNewEnsayoOpen}
                setIsNewEnsayoOpen={setIsNewEnsayoOpen}
                isResultOpen={isResultOpen}
                setIsResultOpen={setIsResultOpen}
                addEnsayo={addEnsayoPHI}
                updateEnsayo={updateEnsayoPHI}
                ensayosActivos={ensayosActivos}
            />
        </div>
    );
}
