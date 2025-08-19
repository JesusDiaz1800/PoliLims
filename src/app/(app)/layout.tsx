
import React, { Suspense } from 'react';
import AppLayoutClient from './app-layout-client';
import Loading from './loading';
import { findUserByUsername } from '@/services/user-service';

export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    // In a real app, user would come from session. For the prototype, we use a default user.
    const user = await findUserByUsername('jdiaz'); 

    return (
        <Suspense fallback={<Loading />}>
            <AppLayoutClient user={user}>
                {children}
            </AppLayoutClient>
        </Suspense>
    );
}
