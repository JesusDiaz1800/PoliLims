import { getInitialData } from '@/services/data-service';
import AppLayoutClient from './app-layout-client';

// This is a Server Component responsible for fetching initial data.
export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    const initialData = await getInitialData();

    return (
        <AppLayoutClient initialData={initialData}>
            {children}
        </AppLayoutClient>
    );
}
