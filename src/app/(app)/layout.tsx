
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { DataProvider } from '@/context/data-context';
import { findUserByUsername } from '@/services/user-service';

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
            <DataProvider>
                <div className="bg-background">
                    <SidebarProvider>
                        <AppShell user={user}>
                            {children}
                        </AppShell>
                    </SidebarProvider>
                </div>
            </DataProvider>
        </ThemeProvider>
    );
}
