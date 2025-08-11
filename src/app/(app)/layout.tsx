
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { findUserByUsername } from '@/services/user-service';
import { ChatWidget, ChatWidgetProvider } from '@/components/soporte/chat-widget';

export const metadata: Metadata = {
    title: {
        template: '%s | PoliLIMS',
        default: 'PoliLIMS',
    },
    description: 'Laboratorio de Ensayos Polifusión S.A.',
};

export default async function AppLayout({ 
    children,
    searchParams 
}: { 
    children: React.ReactNode,
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Get user from search params to pass to AppShell
    // This is a simplified way to handle user session for this example
    const username = (searchParams?.user as string) || 'jdiaz';
    const user = await findUserByUsername(username);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
                <ChatWidgetProvider>
                    <SidebarProvider>
                        <AppShell user={user}>
                            {children}
                        </AppShell>
                    </SidebarProvider>
                    <ChatWidget />
                </ChatWidgetProvider>
        </ThemeProvider>
    );
}
