
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  href?: string;
};

export function StatsCard({ title, value, icon: Icon, description, href }: StatsCardProps) {
    const trendDirection = description.startsWith('+') ? 'up' : 'down';
    const isPositive = trendDirection === "up";

    const cardContent = (
        <Card className={cn("card-glass transition-all hover:shadow-glow hover:-translate-y-1 animate-in fade-in-from-bottom-4 duration-500 flex flex-col h-full", href && "hover:border-primary/50")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col flex-grow justify-end">
                <div className="text-2xl font-bold font-headline">{value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className={cn("flex items-center gap-0.5", isPositive ? "text-green-400" : "text-red-400")}>
                        {isPositive ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3"/>}
                        {description.split(' ')[0]}
                    </span>
                    <span className="text-muted-foreground/80">{description.substring(description.indexOf(' '))}</span>
                </div>
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">{cardContent}</Link>;
    }

    return cardContent;
}
