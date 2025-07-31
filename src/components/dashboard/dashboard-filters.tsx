
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from 'react';
import { Calendar as CalendarIcon, User, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

interface DashboardFiltersProps {
    analysts: { value: string, label: string }[];
    defaultValues: {
        month: string;
        analyst: string;
        status: string;
    };
}

export function DashboardFilters({ analysts, defaultValues }: DashboardFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    );

    const handleFilterChange = (filterName: 'month' | 'analyst' | 'status') => (value: string) => {
        router.push(`${pathname}?${createQueryString(filterName, value)}`);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                        <CardTitle>Filtros del Dashboard</CardTitle>
                        <CardDescription>Seleccione los filtros para visualizar los datos del laboratorio.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <Select value={defaultValues.month} onValueChange={handleFilterChange("month")}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por mes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                                <SelectItem value="this_month">Este Mes</SelectItem>
                                <SelectItem value="last_month">Mes Pasado</SelectItem>
                                <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={defaultValues.analyst} onValueChange={handleFilterChange("analyst")}>
                            <SelectTrigger className="w-full sm:w-auto">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por analista" />
                            </SelectTrigger>
                            <SelectContent>
                                {analysts.map(analyst => (
                                    <SelectItem key={analyst.value} value={analyst.value}>{analyst.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Select value={defaultValues.status} onValueChange={handleFilterChange("status")}>
                            <SelectTrigger className="w-full sm:w-auto">
                                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Estados</SelectItem>
                                <SelectItem value="aprobado">Aprobado</SelectItem>
                                <SelectItem value="en_progreso">En Progreso</SelectItem>
                                <SelectItem value="rechazado">Rechazado</SelectItem>
                                 <SelectItem value="pendiente_de_revision">Pendiente de Revisión</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
