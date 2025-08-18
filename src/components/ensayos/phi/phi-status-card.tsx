
"use client";

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EnsayoPHI } from '@/context/data-context';
import { PhiProgressBar } from './phi-progress-bar';
import { PhiTimer } from './phi-timer';
import { format } from 'date-fns';
import { Calendar, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhiStatusCardProps {
  ensayo: EnsayoPHI;
}

const CalculoFechaFin = ({ fechaInicio, horas }: { fechaInicio: string, horas: number }) => {
    const [fechaFin, setFechaFin] = React.useState('Calculando...');

    React.useEffect(() => {
        const inicio = new Date(fechaInicio);
        if (!isNaN(inicio.getTime())) {
            const fechaFinEstimada = new Date(inicio.getTime() + horas * 60 * 60 * 1000);
            setFechaFin(format(fechaFinEstimada, 'dd-MM-yyyy HH:mm'));
        } else {
            setFechaFin('Fecha inválida');
        }
    }, [fechaInicio, horas]);

    return <span>{fechaFin}</span>;
};

const getColorForRaya = (raya: string) => {
    const colors: {[key: string]: string} = {
        'azul': '#3b82f6',
        'roja': '#ef4444',
        'verde': '#22c55e',
        'blanca': '#e5e5e5',
        'negra': '#171717',
    }
    return colors[raya.toLowerCase()] || '#6b7280'; // gray-500 for default
}

export function PhiStatusCard({ ensayo }: PhiStatusCardProps) {
    const isSinRaya = !ensayo.raya || ensayo.raya.toLowerCase() === 'sin raya';
    const badgeColor = isSinRaya ? undefined : getColorForRaya(ensayo.raya);
    const textColor = isSinRaya || ensayo.raya.toLowerCase() === 'blanca' ? 'black' : 'white';

    return (
        <Card className="flex flex-col justify-between shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold leading-tight max-w-[80%]">{ensayo.producto}</CardTitle>
                    <Badge style={{ backgroundColor: badgeColor, color: textColor }} className="border border-black/20">{ensayo.raya}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
                 <PhiTimer 
                    fechaInicio={ensayo.fechaInicio} 
                    horas={ensayo.horas} 
                    isComplete={ensayo.estado !== 'EN PROCESO'}
                />
                <div className="w-full px-4">
                   <PhiProgressBar
                        fechaInicio={ensayo.fechaInicio}
                        horas={ensayo.horas}
                        isComplete={ensayo.estado !== 'EN PROCESO'}
                    />
                </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground flex justify-between bg-muted/50 p-3">
                 <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3"/>
                    <span>{ensayo.horas}h</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3"/>
                    <span>
                        Finaliza: <CalculoFechaFin fechaInicio={ensayo.fechaInicio} horas={ensayo.horas} />
                    </span>
                 </div>
            </CardFooter>
        </Card>
    )
}
