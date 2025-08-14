
"use client";

import { Hand } from "lucide-react";
import type { User } from "@/services/user-service";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardThemeToggle } from "./dashboard-theme-toggle";

interface WelcomeBannerProps {
  user: User | null;
  theme: string;
  setTheme: (theme: 'light' | 'dark') => void;
}

const WelcomeBannerInternal = ({ user, theme, setTheme }: WelcomeBannerProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-4">
            <SidebarTrigger aria-label="Toggle sidebar" className="text-white hover:bg-white/10 hover:text-white"/>
            <div className="flex-1">
                <h1 className="text-2xl font-bold font-headline">¡Bienvenido, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-base text-muted-foreground">Resumen del estado actual del laboratorio.</p>
            </div>
            <DashboardThemeToggle theme={theme} setTheme={setTheme} />
        </div>
    </div>
  );
}
export const WelcomeBanner = React.memo(WelcomeBannerInternal);
