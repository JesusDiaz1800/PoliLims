
"use client";

import * as React from 'react';
import { CalculadoraIncertidumbre } from "@/components/incertidumbre/incertidumbre-calculadora";
import { HistoricoIncertidumbre } from "@/components/incertidumbre/incertidumbre-historico";
import type { CalculoIncertidumbre } from "@/context/data-context";
import Loading from "../../loading";
import * as dataService from "@/services/data-service";
import { useToast } from '@/hooks/use-toast';

export default function IncertidumbrePage() {
    const [calculos, setCalculos] = React.useState<CalculoIncertidumbre[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { toast } = useToast();

    React.useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await dataService.getInitialData();
            setCalculos(data.calculosIncertidumbre);
            setIsLoading(false);
        }
        loadData();
    }, []);

    const handleCalculoGuardado = async (nuevoCalculo: Omit<CalculoIncertidumbre, 'id'>) => {
        // Simula la adición del cálculo y la actividad reciente
        try {
            const calculoGuardado = await dataService.addCalculoIncertidumbre(nuevoCalculo);
            await dataService.addRecentActivity({
                user: "Victor Lutz",
                action: `realizó un nuevo cálculo de incertidumbre: ${nuevoCalculo.nombre}`,
            });

            // Actualiza el estado local para reflejar el cambio inmediatamente en la UI
            setCalculos(prevCalculos => [calculoGuardado, ...prevCalculos]);
            
            toast({
                title: "Cálculo Guardado",
                description: "El cálculo de incertidumbre se ha guardado en el historial.",
            });

        } catch (error) {
             toast({
                variant: "destructive",
                title: "Error al Guardar",
                description: "No se pudo guardar el cálculo de incertidumbre.",
            });
        }
    };


    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="space-y-6">
            <CalculadoraIncertidumbre onCalculoGuardado={handleCalculoGuardado} />
            <HistoricoIncertidumbre calculos={calculos} />
        </div>
    );
}
