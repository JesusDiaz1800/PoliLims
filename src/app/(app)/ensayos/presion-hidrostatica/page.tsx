
"use client";

import * as React from 'react';
import { PhiTable } from '@/components/ensayos/phi/phi-table';
import { PhiDialogs } from '@/components/ensayos/phi/phi-dialogs';
import { useDynamicData } from '@/context/data-context';
import Loading from '@/app/(app)/loading';
import { LogoAlt } from '@/components/logo-alt';
import { Button } from '@/components/ui/button';
import { FilePlus2, Edit } from 'lucide-react';

export default function ResistenciaPresionHidrostaticaPage() {
    const { ensayosPHI, addEnsayoPHI, updateEnsayoPHI, isLoaded } = useDynamicData();
    const [isNewEnsayoOpen, setIsNewEnsayoOpen] = React.useState(false);
    const [isResultOpen, setIsResultOpen] = React.useState(false);

    if (!isLoaded) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b-2 border-primary print:hidden">
                <div className="w-48">
                    <LogoAlt />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold font-headline uppercase">Registro de Resistencia a la Presión Hidrostática Interna</h1>
                    <p className="text-sm text-muted-foreground">LEP-DGC-021, Versión 01</p>
                </div>
                <div className="space-x-2">
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

            <PhiTable data={ensayosPHI} />
            
            <PhiDialogs
                isNewEnsayoOpen={isNewEnsayoOpen}
                setIsNewEnsayoOpen={setIsNewEnsayoOpen}
                isResultOpen={isResultOpen}
                setIsResultOpen={setIsResultOpen}
                addEnsayo={addEnsayoPHI}
                updateEnsayo={updateEnsayoPHI}
                ensayosActivos={ensayosPHI.filter(e => e.estado === 'EN PROCESO')}
            />
        </div>
    );
}
