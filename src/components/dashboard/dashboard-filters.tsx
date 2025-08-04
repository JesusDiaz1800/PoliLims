
"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from 'react';
import { Calendar as CalendarIcon, User, Package, TestTube, Truck } from "lucide-react";
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
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface DashboardFiltersProps {
    analysts: { value: string, label: string }[];
    assayTypes: { value: string, label: string }[];
    suppliers: { value: string, label: string }[];
    defaultValues: {
        month: string;
        analyst: string;
        status: string;
        type: string;
        supplier: string;
    };
}

export function DashboardFilters({ analysts, assayTypes, suppliers, defaultValues }: DashboardFiltersProps) {
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

    const handleFilterChange = (filterName: 'month' | 'analyst' | 'status' | 'type' | 'supplier') => (value: string) => {
        router.push(`${pathname}?${createQueryString(filterName, value)}`);
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
                    <div className="space-y-1.5 flex-1 hidden lg:block">
                        <CardTitle className="text-base">Filtros</CardTitle>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-end gap-2 w-full">
                        <Select value={defaultValues.month} onValueChange={handleFilterChange("month")}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por mes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last_30_days">Últimos 30 días</SelectItem>
                                <SelectItem value="this_month">Este Mes</SelectItem>
                                <SelectItem value="last_month">Mes Pasado</SelectItem>
                                <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                                <SelectItem value="last_12_months">Últimos 12 Meses</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={defaultValues.analyst} onValueChange={handleFilterChange("analyst")}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9">
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
                            <SelectTrigger className="w-full sm:w-[180px] h-9">
                                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Estados</SelectItem>
                                <SelectItem value="aprobado">Aprobado</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="rechazado">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={defaultValues.type} onValueChange={handleFilterChange("type")}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9">
                                <TestTube className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {assayTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={defaultValues.supplier} onValueChange={handleFilterChange("supplier")}>
                            <SelectTrigger className="w-full sm:w-[180px] h-9">
                                <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Filtrar por proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map(supplier => (
                                    <SelectItem key={supplier.value} value={supplier.value}>{supplier.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
