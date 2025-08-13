
"use client";

import * as React from 'react';
import { CalculadoraIncertidumbre } from "@/components/incertidumbre/incertidumbre-calculadora";
import { HistoricoIncertidumbre } from "@/components/incertidumbre/incertidumbre-historico";
import type { CalculoIncertidumbre } from "@/context/data-context";
import Loading from "../../loading";
import { useDynamicData } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';

export default function IncertidumbrePage() {
    const { calculosIncertidumbre, addCalculoIncertidumbre, addRecentActivity, isLoaded } = useDynamicData();
    const { toast } = useToast();

    const handleCalculoGuardado = async (nuevoCalculo: Omit<CalculoIncertidumbre, 'id'>) => {
        try {
            await addCalculoIncertidumbre(nuevoCalculo);
            await addRecentActivity({
                user: "Victor Lutz", // This should be dynamic
                action: `realizó un nuevo cálculo de incertidumbre: ${nuevoCalculo.nombre}`,
            });
            
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


    if (!isLoaded) {
        return <Loading/>
    }

    return (
        <div className="space-y-6">
            <CalculadoraIncertidumbre onCalculoGuardado={handleCalculoGuardado} />
            <HistoricoIncertidumbre calculos={calculosIncertidumbre} />
        </div>
    );
}
