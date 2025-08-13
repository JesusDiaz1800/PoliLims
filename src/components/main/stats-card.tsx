
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

    const cardInnerContent = (
        <Card className="card-glass h-full w-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background group-active:scale-[0.98]">
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
        return (
            <Link href={href} className="group focus:outline-none rounded-lg">
                {cardInnerContent}
            </Link>
        );
    }

    return cardInnerContent;
}
