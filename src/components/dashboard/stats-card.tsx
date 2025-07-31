
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import type { DashboardFilters } from "@/app/(app)/dashboard/page";


type StatsCardProps = {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    filters?: DashboardFilters;
};

export function StatsCard({ title, value: initialValue, description, icon: Icon, filters }: StatsCardProps) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        if (!filters) return;
        
        // Simulate a change in data based on filters
        const numericValue = parseFloat(initialValue.split(' ')[0]);
        if (!isNaN(numericValue)) {
            const newValue = Math.round(numericValue * (Math.random() * 0.4 + 0.8)); // Randomize between 80% and 120%
             if (initialValue.includes('/')) {
                const parts = initialValue.split('/');
                setValue(`${newValue} /${parts[1]}`);
            } else {
                setValue(String(newValue));
            }
        }
    }, [filters, initialValue]);


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-headline">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
