
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { DataProvider, getInitialData } from '@/context/data-context';
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
    const username = (searchParams?.user as string) || 'jesus.diaz';
    const user = await findUserByUsername(username);

    // Fetch initial data on the server
    const initialData = await getInitialData();

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <DataProvider initialData={initialData}>
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
