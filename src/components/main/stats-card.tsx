
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
        <Card className={cn("card-glass", href && "hover:bg-accent hover:text-accent-foreground")}>
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

    if (href) {
        return <Link href={href} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">{cardContent}</Link>;
    }

    return cardContent;
}
