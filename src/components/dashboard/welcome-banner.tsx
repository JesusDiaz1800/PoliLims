
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hand } from "lucide-react";
import type { User } from "@/services/user-service";
import React from "react";

interface WelcomeBannerProps {
  user: User | null;
}

const WelcomeBannerInternal = ({ user }: WelcomeBannerProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
            <Hand className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="text-2xl">¡Bienvenido de vuelta, {user.fullName.split(' ')[0]}!</CardTitle>
                <CardDescription className="text-base text-muted-foreground">Aquí tienes un resumen del estado actual del laboratorio.</CardDescription>
            </div>
        </div>
    </div>
  );
}
export const WelcomeBanner = React.memo(WelcomeBannerInternal);
    
