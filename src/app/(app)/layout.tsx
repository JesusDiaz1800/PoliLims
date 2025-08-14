
import { getInitialData } from '@/services/data-service';
import AppLayoutClient from './app-layout-client';
import { findUserByUsername } from '@/services/user-service';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { middleware } from '@/middleware';

// This is a Server Component responsible for fetching all initial data.
export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    // In a real app with authentication, user would come from session.
    // For this prototype, we simulate it from searchParams.
    
    // Default user if no search param is provided
    let usernameParam = 'jdiaz'; 
    const search = headers().get('x-search');
    
    if (search) {
        try {
            const params = new URLSearchParams(search);
            const username = params.get('user');
            if (username) {
                usernameParam = username;
            }
        } catch(e) {
            console.error("Could not parse search params for user", e);
        }
    }
    
    const user = await findUserByUsername(usernameParam);
    
    // It's safe to assume user is found as we have a default.
    // In a real app, you'd redirect if no user was found after auth check.

    const initialData = await getInitialData();

    return (
        <AppLayoutClient user={user} initialData={initialData}>
            {children}
        </AppLayoutClient>
    );
}
