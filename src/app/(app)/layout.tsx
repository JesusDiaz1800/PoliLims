
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { DataProvider } from '@/context/data-context';
import { getMatrizProductos } from '@/lib/matriz-datos';
import { getProductsFromSap } from '@/services/sap-service';
import { findUserByUsername, type User } from '@/services/user-service';

export const metadata: Metadata = {
    title: {
        template: '%s | PoliLIMS',
        default: 'PoliLIMS',
    },
    description: 'Laboratorio de Ensayos Polifusión S.A.',
};

export default async function AppLayout({ children, ...props }: { children: React.ReactNode, params: any }) {
    // Load static data once on the server layout
    const productMatrix = await getMatrizProductos();
    const sapProducts = await getProductsFromSap();
    
    // Get user from search params to pass to AppShell
    // This is a simplified way to handle user session for this example
    const searchParams = (props as any).searchParams || {};
    const username = searchParams?.user || 'jesus.diaz';
    const user = await findUserByUsername(username);


    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <DataProvider staticData={{ productMatrix, sapProducts }}>
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
