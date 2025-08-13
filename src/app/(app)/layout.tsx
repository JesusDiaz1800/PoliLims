import { getInitialData } from '@/services/data-service';
import AppLayoutClient from './app-layout-client';
import { DynamicDataProvider } from '@/context/data-context';

// This is a Server Component responsible for fetching initial data.
export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    const initialData = await getInitialData();

    return (
        <DynamicDataProvider initialData={initialData}>
            <AppLayoutClient>
                {children}
            </AppLayoutClient>
        </DynamicDataProvider>
    );
}
