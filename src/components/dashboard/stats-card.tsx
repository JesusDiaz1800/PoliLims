
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type Trend = 'up' | 'down';
type TrendDirection = 'positive' | 'negative';

type StatsCardProps = {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    href?: string;
    trend?: Trend;
    trendDirection?: TrendDirection;
};

const StatsCardInternal = ({ title, value, description, icon: Icon, href, trend, trendDirection }: StatsCardProps) => {
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

    const isPositive = (trend === 'up' && trendDirection === 'positive') || (trend === 'down' && trendDirection === 'negative');
    const isNegative = (trend === 'up' && trendDirection === 'negative') || (trend === 'down' && trendDirection === 'positive');
    
    // Definir colores modernos y futuristas para cada tipo de tarjeta
    const getCardColors = () => {
        if (title.includes('Total Ensayos')) {
            return {
                gradient: 'from-blue-600/20 via-cyan-600/20 to-indigo-600/20 dark:from-blue-500/30 dark:via-cyan-500/30 dark:to-indigo-500/30',
                border: 'border-blue-500/40 dark:border-blue-400/30',
                shadow: 'shadow-blue-500/30 dark:shadow-blue-400/20',
                iconBg: 'from-blue-500/40 to-cyan-500/40 dark:from-blue-400/50 dark:to-cyan-400/50',
                iconColor: 'text-blue-700 dark:text-blue-300',
                textColor: 'text-slate-900 dark:text-white',
                titleColor: 'text-slate-800 dark:text-white/90',
                descriptionColor: 'text-slate-600 dark:text-white/70'
            };
        } else if (title.includes('Aprobación')) {
            return {
                gradient: 'from-emerald-600/20 via-teal-600/20 to-green-600/20 dark:from-emerald-500/30 dark:via-teal-500/30 dark:to-green-500/30',
                border: 'border-emerald-500/40 dark:border-emerald-400/30',
                shadow: 'shadow-emerald-500/30 dark:shadow-emerald-400/20',
                iconBg: 'from-emerald-500/40 to-teal-500/40 dark:from-emerald-400/50 dark:to-teal-400/50',
                iconColor: 'text-emerald-700 dark:text-emerald-300',
                textColor: 'text-slate-900 dark:text-white',
                titleColor: 'text-slate-800 dark:text-white/90',
                descriptionColor: 'text-slate-600 dark:text-white/70'
            };
        } else if (title.includes('Pendientes')) {
            return {
                gradient: 'from-amber-600/20 via-orange-600/20 to-yellow-600/20 dark:from-amber-500/30 dark:via-orange-500/30 dark:to-yellow-500/30',
                border: 'border-amber-500/40 dark:border-amber-400/30',
                shadow: 'shadow-amber-500/30 dark:shadow-amber-400/20',
                iconBg: 'from-amber-500/40 to-orange-500/40 dark:from-amber-400/50 dark:to-orange-400/50',
                iconColor: 'text-amber-700 dark:text-amber-300',
                textColor: 'text-slate-900 dark:text-white',
                titleColor: 'text-slate-800 dark:text-white/90',
                descriptionColor: 'text-slate-600 dark:text-white/70'
            };
        } else if (title.includes('Equipos')) {
            return {
                gradient: 'from-purple-600/20 via-violet-600/20 to-indigo-600/20 dark:from-purple-500/30 dark:via-violet-500/30 dark:to-indigo-500/30',
                border: 'border-purple-500/40 dark:border-purple-400/30',
                shadow: 'shadow-purple-500/30 dark:shadow-purple-400/20',
                iconBg: 'from-purple-500/40 to-violet-500/40 dark:from-purple-400/50 dark:to-violet-400/50',
                iconColor: 'text-purple-700 dark:text-purple-300',
                textColor: 'text-slate-900 dark:text-white',
                titleColor: 'text-slate-800 dark:text-white/90',
                descriptionColor: 'text-slate-600 dark:text-white/70'
            };
        } else if (title.includes('NC Abiertas')) {
            return {
                gradient: 'from-red-600/20 via-pink-600/20 to-rose-600/20 dark:from-red-500/30 dark:via-pink-500/30 dark:to-rose-500/30',
                border: 'border-red-500/40 dark:border-red-400/30',
                shadow: 'shadow-red-500/30 dark:shadow-red-400/20',
                iconBg: 'from-red-500/40 to-pink-500/40 dark:from-red-400/50 dark:to-pink-400/50',
                iconColor: 'text-red-700 dark:text-red-300',
                textColor: 'text-slate-900 dark:text-white',
                titleColor: 'text-slate-800 dark:text-white/90',
                descriptionColor: 'text-slate-600 dark:text-white/70'
            };
        }
        return {
            gradient: 'from-slate-600/20 via-gray-600/20 to-zinc-600/20 dark:from-slate-500/30 dark:via-gray-500/30 dark:to-zinc-500/30',
            border: 'border-slate-500/40 dark:border-slate-400/30',
            shadow: 'shadow-slate-500/30 dark:shadow-slate-400/20',
            iconBg: 'from-slate-500/40 to-gray-500/40 dark:from-slate-400/50 dark:to-gray-400/50',
            iconColor: 'text-slate-700 dark:text-slate-300',
            textColor: 'text-slate-900 dark:text-white',
            titleColor: 'text-slate-800 dark:text-white/90',
            descriptionColor: 'text-slate-600 dark:text-white/70'
        };
    };

    const colors = getCardColors();
    
    const descriptionColor = cn(
      "text-xs font-medium",
      isPositive && "text-emerald-600 dark:text-emerald-400",
      isNegative && "text-red-600 dark:text-red-400",
      !isPositive && !isNegative && "text-blue-600/80 dark:text-blue-400/80"
    );

    return (
        <Card 
            className={cn(
                "relative overflow-hidden transition-all duration-500 group",
                "bg-gradient-to-br", colors.gradient,
                "border", colors.border,
                "shadow-lg", colors.shadow,
                "hover:shadow-xl hover:scale-105 hover:border-opacity-50",
                "backdrop-blur-sm",
                href && "cursor-pointer"
            )}
            onMouseEnter={handlePrefetch}
            onClick={handleClick}
        >
            {/* Efectos de iluminación de borde */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            
            {/* Líneas de iluminación */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className={cn("text-sm font-semibold", colors.titleColor)}>{title}</CardTitle>
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl",
                    "bg-gradient-to-br", colors.iconBg,
                    "border border-white/10 shadow-lg",
                    "group-hover:scale-110 transition-transform duration-300"
                )}>
                    <Icon className={cn("h-5 w-5", colors.iconColor)} />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className={cn("text-3xl font-bold font-headline mb-2", colors.textColor)}>{value}</div>
                <div className="flex items-center gap-2">
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            isPositive && "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30 dark:border-emerald-400/20",
                            isNegative && "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-400/30 dark:border-red-400/20"
                        )}>
                            {trend === 'up' ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {trend === 'up' ? '↑' : '↓'}
                        </div>
                    )}
                    <p className={descriptionColor}>{description}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export const StatsCard = React.memo(StatsCardInternal);
