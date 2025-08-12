import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendDirection: "up" | "down";
};

export function StatsCard({ title, value, icon: Icon, trend, trendDirection }: StatsCardProps) {
    const isPositive = trendDirection === "up";
    return (
        <Card className="card-glass transition-all hover:shadow-glow hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-headline">{value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className={cn("flex items-center gap-0.5", isPositive ? "text-green-400" : "text-red-400")}>
                        {isPositive ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3"/>}
                        {trend.split(' ')[0]}
                    </span>
                    <span className="text-muted-foreground/80">{trend.substring(trend.indexOf(' '))}</span>
                </div>
            </CardContent>
        </Card>
    );
}
