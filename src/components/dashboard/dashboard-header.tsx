"use client";

import React from "react";
import { NotificationDropdown } from "../notifications/notification-dropdown";
import { ThemeToggle } from "../theme-toggle";
import { LogoAlt } from "../logo-alt";
import { SidebarTrigger } from "../ui/sidebar";
import type { User } from "@/services/user-service";
import { Sparkles, TrendingUp, Activity } from "lucide-react";

interface DashboardHeaderProps {
  user: User | null;
  title?: string;
  subtitle?: string;
}

const DashboardHeaderInternal = ({ 
  user, 
  title = "Dashboard", 
  subtitle = "Resumen del estado actual del laboratorio" 
}: DashboardHeaderProps) => {
  if (!user) {
    return null;
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 relative overflow-hidden bg-gradient-to-r from-white/95 via-blue-50/90 to-indigo-50/95 dark:from-slate-900/95 dark:via-blue-900/90 dark:to-indigo-900/95 border border-blue-500/30 dark:border-blue-400/20 rounded-2xl p-6 mb-8 shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/10 backdrop-blur-xl">
      {/* Efectos de iluminación de fondo */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:via-cyan-500/5 dark:to-indigo-500/5" />
      <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent dark:via-blue-400/20" />
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent dark:via-cyan-400/15" />
      
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl border shadow-lg bg-gradient-to-br from-blue-500/40 to-indigo-600/40 dark:from-blue-500/30 dark:to-indigo-600/30 border-blue-400/50 dark:border-blue-400/30">
            <SidebarTrigger 
              aria-label="Toggle sidebar" 
              className="transition-colors text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100" 
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-cyan-700 to-indigo-700 dark:from-blue-300 dark:via-cyan-300 dark:to-indigo-300">
                  {title}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-blue-500/20 dark:bg-blue-500/10 border-blue-400/40 dark:border-blue-400/20">
                  <Sparkles className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {`¡Bienvenido, ${typeof user.fullName === 'string' && user.fullName.trim() ? user.fullName.trim().split(' ')[0] : 'Usuario'}!`}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-cyan-700 dark:text-cyan-300" />
              <p className="text-base font-medium text-blue-800/90 dark:text-blue-100/90">
                {subtitle}
              </p>
              <div className="flex items-center gap-1 px-2 py-1 rounded-md border bg-emerald-500/20 dark:bg-emerald-500/10 border-emerald-400/40 dark:border-emerald-400/20">
                <TrendingUp className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                <span className="text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  Sistema Activo
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-blue-500/20 dark:bg-blue-500/10 border-blue-400/40 dark:border-blue-400/20">
            <NotificationDropdown />
            <ThemeToggle />
          </div>
          <div className="w-14 h-14 rounded-xl border shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-indigo-600/40 dark:from-blue-500/30 dark:to-indigo-600/30 border-blue-400/50 dark:border-blue-400/30">
            <LogoAlt />
          </div>
        </div>
      </div>
    </div>
  );
}

export const DashboardHeader = React.memo(DashboardHeaderInternal);
