"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/services/user-service";

interface WelcomeBannerProps {
  user?: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 6 && currentHour < 12;
  const isAfternoon = currentHour >= 12 && currentHour < 18;
  const isEvening = currentHour >= 18 && currentHour < 22;
  const isNight = currentHour >= 22 || currentHour < 6;

  const getGreeting = () => {
    if (isMorning) return "¡Buenos días!";
    if (isAfternoon) return "¡Buenas tardes!";
    if (isEvening) return "¡Buenas noches!";
    return "¡Buenas noches!";
  };

  const getIcon = () => {
    if (isMorning) return Sun;
    if (isAfternoon) return Coffee;
    if (isEvening) return Moon;
    return Zap;
  };

  const Icon = getIcon();

  return (
    <Card className="mb-6 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {getGreeting()}, {user?.nombre || 'Usuario'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bienvenido al sistema de gestión de laboratorio más avanzado del mundo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Sistema Operativo
            </Badge>
            <Button variant="outline" size="sm">
              Ver Tutorial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
