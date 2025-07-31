
import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';
import { ThemeProvider } from '@/components/theme-provider';
import { DataProvider } from '@/context/data-context';
import { getMatrizProductos } from '@/lib/matriz-datos';
import { getProductsFromSap } from '@/services/sap-service';

export const metadata: Metadata = {
    title: {
        template: '%s | PoliLIMS',
        default: 'PoliLIMS',
    },
    description: 'Laboratorio de Ensayos Polifusión S.A.',
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    // Load static data once on the server layout
    const productMatrix = await getMatrizProductos();
    const sapProducts = await getProductsFromSap();

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <DataProvider staticData={{ productMatrix, sapProducts }}>
                <div className="bg-background">
                    <SidebarProvider>
                        <AppShell>
                            {children}
                        </AppShell>
                    </SidebarProvider>
                </div>
            </DataProvider>
        </ThemeProvider>
    );
}
