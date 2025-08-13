
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

interface DashboardFiltersProps {
    analysts: { value: string, label: string }[];
    assayTypes: { value: string, label: string }[];
    suppliers: { value: string, label: string }[];
}

export function DashboardFilters({ analysts, assayTypes, suppliers }: DashboardFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get current filter values from URL or set defaults
    const month = searchParams.get('month') || 'last_12_months';
    const analyst = searchParams.get('analyst') || 'all';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const supplier = searchParams.get('supplier') || 'all';

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
        <div className="p-2 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                <Select value={month} onValueChange={handleFilterChange("month")}>
                    <SelectTrigger className="w-full h-9 text-xs">
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
                <Select value={analyst} onValueChange={handleFilterChange("analyst")}>
                    <SelectTrigger className="w-full h-9 text-xs">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar por analista" />
                    </SelectTrigger>
                    <SelectContent>
                        {analysts.map(analyst => (
                            <SelectItem key={analyst.value} value={analyst.value}>{analyst.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={status} onValueChange={handleFilterChange("status")}>
                    <SelectTrigger className="w-full h-9 text-xs">
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
                <Select value={type} onValueChange={handleFilterChange("type")}>
                    <SelectTrigger className="w-full h-9 text-xs">
                        <TestTube className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                        {assayTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={supplier} onValueChange={handleFilterChange("supplier")}>
                    <SelectTrigger className="w-full h-9 text-xs lg:col-span-2">
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
    );
}
