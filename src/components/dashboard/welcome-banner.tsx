
"use client";

import { Hand } from "lucide-react";
import type { User } from "@/services/user-service";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
            <SidebarTrigger aria-label="Toggle sidebar" className="text-white hover:bg-white/10 hover:text-white"/>
            <Hand className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-2xl font-bold font-headline">¡Bienvenido de vuelta, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-base text-muted-foreground">Aquí tienes un resumen del estado actual del laboratorio.</p>
            </div>
        </div>
    </div>
  );
}
export const WelcomeBanner = React.memo(WelcomeBannerInternal);
