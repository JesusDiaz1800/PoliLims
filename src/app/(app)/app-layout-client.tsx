
'use client'
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import type { User } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';
import React from 'react';
import { DynamicDataProvider, type InitialData } from '@/context/data-context';
import RootPrefetch from '@/components/root-prefetch';

export default function AppLayoutClient({ 
    children,
    user,
    initialData,
}: { 
    children: React.ReactNode,
    user: User | null;
    initialData: InitialData
}) {
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
                        <ChatWidget />
                    </SidebarProvider>
                </ChatWidgetProvider>
            </DynamicDataProvider>
            <RootPrefetch />
        </ThemeProvider>
    );
}
