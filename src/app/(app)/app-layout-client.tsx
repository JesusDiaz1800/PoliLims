
'use client'
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import type { User } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { DynamicDataProvider, type InitialData } from '@/context/data-context';

export default function AppLayoutClient({ 
    children,
    user,
    initialData,
}: { 
    children: React.ReactNode,
    user: User | null;
    initialData: InitialData
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

    if (!user) {
        // This should ideally not happen if layout logic is correct,
        // but it's a safe fallback.
        return null; 
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <DynamicDataProvider initialData={initialData} user={user}>
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
