
'use client'
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { findUserByUsername } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';
import { DynamicDataProvider } from '@/context/data-context';
import { getInitialData } from '@/services/data-service';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Este componente ahora es un Client Component para usar hooks como usePathname.
// Los datos se siguen obteniendo del servidor en el layout superior o en la misma página.

export default function AppLayout({ 
    children,
    user,
    initialData,
}: { 
    children: React.ReactNode,
    user: Awaited<ReturnType<typeof findUserByUsername>>,
    initialData: Awaited<ReturnType<typeof getInitialData>>
}) {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/main') {
            document.body.classList.add('dashboard-futurista');
        } else {
            document.body.classList.remove('dashboard-futurista');
        }

        // Cleanup function to remove the class when the component unmounts
        // or the path changes away from /main
        return () => {
            document.body.classList.remove('dashboard-futurista');
        };
    }, [pathname]);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <DynamicDataProvider initialData={initialData}>
                <ChatWidgetProvider>
                    <SidebarProvider>
                        <AppShell user={user}>
                            {children}
                        </AppShell>
                    </SidebarProvider>
                    <ChatWidget />
                </ChatWidgetProvider>
            </DynamicDataProvider>
        </ThemeProvider>
    );
}
