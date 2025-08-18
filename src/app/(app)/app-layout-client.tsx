
"use client";

import React from "react";
import { AppShell } from '@/components/app-shell';
import type { User } from '@/services/user-service';
import { useDynamicData } from '@/context/data-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatWidgetProvider, ChatWidget } from '@/components/soporte/chat-widget';

export default function AppLayoutClient({ 
    children,
    user,
}: { 
    children: React.ReactNode,
    user: User | null;
}) {
    const { setUser } = useDynamicData();
    
    // Set the user in the context once the client component mounts.
    React.useEffect(() => {
        if(user) {
            setUser(user);
        }
    }, [user, setUser]);

    if (!user) {
        // You can return a loader here or null if the app layout shouldn't be rendered without a user.
        return null;
    }
    
    return (
        <ChatWidgetProvider>
            <SidebarProvider>
                <AppShell user={user}>
                    {children}
                </AppShell>
                <ChatWidget />
            </SidebarProvider>
        </ChatWidgetProvider>
    );
}
