
import React, { Suspense } from 'react';
import AppLayoutClient from './app-layout-client';
import Loading from './loading';
import { findUserByUsername } from '@/services/user-service';
import { DynamicDataProvider } from '@/context/data-context';
import { getInitialData } from '@/services/data-service';

export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    // In a real app, user would come from session. For the prototype, we use a default user.
    const user = await findUserByUsername('jdiaz'); 
    const initialData = await getInitialData();

    return (
        <Suspense fallback={<Loading />}>
            <DynamicDataProvider initialData={initialData}>
                <AppLayoutClient user={user}>
                    {children}
                </AppLayoutClient>
            </DynamicDataProvider>
        </Suspense>
    );
}
