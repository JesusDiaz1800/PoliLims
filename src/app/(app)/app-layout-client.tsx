
"use client";

import React, { Suspense, lazy } from "react";
import dynamic from 'next/dynamic';
import type { User } from '@/services/user-service';
import { findUserByUsername, mockUser } from '@/services/user-service';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from "next-themes";
import { DynamicDataProvider } from "@/context/data-context-optimized";
import { FilterProvider } from "@/context/filter-context";
import { usePrefetchRoutes } from '@/lib/route-prefetcher';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/context/auth-context';

// Lazy load components that are not immediately needed
const AppShell = lazy(() => 
    import('@/components/app-shell-optimized').then(mod => ({ default: mod.AppShell }))
);

const ChatWidget = dynamic(() => 
    import('@/components/soporte/chat-widget').then(mod => mod.ChatWidget), 
    { ssr: false }
);

const ChatWidgetProvider = dynamic(() => 
    import('@/components/soporte/chat-widget').then(mod => mod.ChatWidgetProvider), 
    { ssr: false }
);

export default function AppLayoutClient({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    const { user } = useAuth();
    const [renderChat, setRenderChat] = React.useState(false);
    
    React.useEffect(() => {
        const id = window.setTimeout(() => setRenderChat(true), 1500);
        return () => window.clearTimeout(id);
    }, []);
    
    // Prefetch rutas basadas en el rol del usuario
    usePrefetchRoutes(user?.role || 'Jefe de Calidad');

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <DynamicDataProvider>
                <FilterProvider>
                    <Suspense fallback={<div className="min-h-screen bg-background" />}>
                        <ChatWidgetProvider>
                            <SidebarProvider>
                                <Suspense fallback={
                                    <div className="flex items-center justify-center min-h-screen bg-background">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                }>
                                    <AuthGuard>
                                        <AppShell user={user!}>
                                            {children}
                                        </AppShell>
                                    </AuthGuard>
                                </Suspense>
                                {renderChat && <ChatWidget />}
                            </SidebarProvider>
                        </ChatWidgetProvider>
                    </Suspense>
                </FilterProvider>
            </DynamicDataProvider>
        </ThemeProvider>
    );
}
