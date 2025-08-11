
"use client";

import * as React from 'react';
import { CalculadoraIncertidumbre } from "@/components/incertidumbre/incertidumbre-calculadora";
import { HistoricoIncertidumbre } from "@/components/incertidumbre/incertidumbre-historico";
import type { CalculoIncertidumbre } from "@/context/data-context";
import Loading from "../../loading";
import * as dataService from "@/services/data-service";

export default function IncertidumbrePage() {
    const [calculos, setCalculos] = React.useState<CalculoIncertidumbre[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            const data = await dataService.getInitialData();
            setCalculos(data.calculosIncertidumbre);
            setIsLoading(false);
        }
        loadData();
    }, []);


    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="space-y-6">
            <CalculadoraIncertidumbre />
            <HistoricoIncertidumbre calculos={calculos} />
        </div>
    );
}
