
import React from 'react';
import AppLayoutClient from './app-layout-client';
import { findUserByUsername } from '@/services/user-service';

// This is a Server Component responsible for fetching the user.
// The initial data is now provided by the root layout.
export default async function AppLayout({ 
    children
}: { 
    children: React.ReactNode,
}) {
    // In a real app with authentication, user would come from session.
    // For this prototype, we simulate a default user.
    // Layouts do not receive searchParams, so we use a fixed user.
    const username = 'jdiaz';
    const user = await findUserByUsername(username); 
    
    // It's safe to assume user is found as we have a default.
    // In a real app, you'd redirect if no user was found after auth check.

    return (
        <AppLayoutClient user={user}>
            {children}
        </AppLayoutClient>
    );
}
