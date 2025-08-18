
import React from 'react';
import AppLayoutClient from './app-layout-client';
import { findUserByUsername } from '@/services/user-service';

export default async function AppLayout({ 
    children,
    searchParams
}: { 
    children: React.ReactNode,
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // In a real app, user would come from session. For the prototype, we get it from the URL.
    const username = (searchParams?.user as string) || 'jdiaz'; 
    const user = await findUserByUsername(username); 

    return (
        <AppLayoutClient user={user}>
            {children}
        </AppLayoutClient>
    );
}
