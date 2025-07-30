import type { Metadata } from 'next';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
    title: {
        template: '%s | PoliLIMS',
        default: 'PoliLIMS',
    },
    description: 'Laboratorio de Ensayos Polifusión S.A.',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background">
            <SidebarProvider>
                <AppShell>
                    {children}
                </AppShell>
            </SidebarProvider>
        </div>
    );
}
