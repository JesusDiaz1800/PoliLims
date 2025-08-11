
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CalculadoraIncertidumbre } from "@/components/incertidumbre/incertidumbre-calculadora";
import { HistoricoIncertidumbre } from "@/components/incertidumbre/incertidumbre-historico";
import { useDynamicData, type CalculoIncertidumbre } from "@/context/data-context";
import Loading from "../../loading";
import type { Metadata } from 'next';

export default function IncertidumbrePage() {
    const { calculosIncertidumbre, isLoading } = useDynamicData();

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className="space-y-6">
            <CalculadoraIncertidumbre />
            <HistoricoIncertidumbre calculos={calculosIncertidumbre} />
        </div>
    );
}
