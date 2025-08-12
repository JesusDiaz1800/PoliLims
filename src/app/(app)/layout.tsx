
'use client'
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { findUserByUsername, type User } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';
import { DynamicDataProvider } from '@/context/data-context';
import { getInitialData } from '@/services/data-service';
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Loading from './loading';

// Este componente ahora es un Client Component para usar hooks como usePathname y useSearchParams.

export default function AppLayout({ 
    children,
    initialData,
}: { 
    children: React.ReactNode,
    initialData: Awaited<ReturnType<typeof getInitialData>>
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => {
        async function loadUser() {
            const username = searchParams.get('user');
            if (username) {
                const userData = await findUserByUsername(username);
                setUser(userData);
            } else {
                // Fallback a un usuario por defecto si no hay ninguno en la URL
                const defaultUser = await findUserByUsername('jdiaz');
                setUser(defaultUser);
            }
            setIsLoading(false);
        }
        loadUser();
    }, [searchParams]);

    if (isLoading || !user) {
        return <Loading />;
    }

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
