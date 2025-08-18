
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    href?: string;
};

const StatsCardInternal = ({ title, value, description, icon: Icon, href }: StatsCardProps) => {
    const router = useRouter();

    const handlePrefetch = () => {
        if (href) {
            router.prefetch(href);
        }
    };
    
    const handleClick = () => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <Card 
            className={cn(
                "transition-colors card-glass", 
                href && "hover:bg-muted/50 cursor-pointer"
            )}
            onMouseEnter={handlePrefetch}
            onClick={handleClick}
        >
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
};

export const StatsCard = React.memo(StatsCardInternal);
