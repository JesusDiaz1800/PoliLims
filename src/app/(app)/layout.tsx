
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { findUserByUsername } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';
import { DynamicDataProvider } from '@/context/data-context';
import { getInitialData } from '@/services/data-service';

export const metadata: Metadata = {
    title: {
        template: '%s | PoliLIMS',
        default: 'PoliLIMS',
    },
    description: 'Laboratorio de Ensayos Polifusión S.A.',
};

/**
 * @layout AppLayout
 * @description This is the main layout for the authenticated part of the application.
 * It sets up all the necessary global providers and pre-fetches all application data
 * on the server to ensure a fast initial load.
 */
export default async function AppLayout({ 
    children,
    searchParams 
}: { 
    children: React.ReactNode,
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Get user from search params to simulate user session for this prototype.
    const username = (searchParams?.user as string) || 'jdiaz';
    const [user, initialData] = await Promise.all([
        findUserByUsername(username),
        getInitialData()
    ]);

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
