

"use client";

import { Hand } from "lucide-react";
import type { User } from "@/services/user-service";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoAlt } from "../logo-alt";

interface WelcomeBannerProps {
  user: User | null;
}

const WelcomeBannerInternal = ({ user }: WelcomeBannerProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-4">
            <SidebarTrigger aria-label="Toggle sidebar"/>
            <div className="flex-1">
                <h1 className="text-2xl font-bold font-headline">¡Bienvenido, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-base text-muted-foreground">Resumen del estado actual del laboratorio.</p>
            </div>
            <div className="flex items-center gap-2">
                 <div className="w-24 hidden sm:block">
                    <LogoAlt />
                </div>
                <ThemeToggle />
            </div>
        </div>
    </div>
  );
}
export const WelcomeBanner = React.memo(WelcomeBannerInternal);
