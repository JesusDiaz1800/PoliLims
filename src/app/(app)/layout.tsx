
import { getInitialData } from '@/services/data-service';
import AppLayoutClient from './app-layout-client';
import { findUserByUsername } from '@/services/user-service';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// This is a Server Component responsible for fetching all initial data.
export default async function AppLayout({ 
    children,
}: { 
    children: React.ReactNode,
}) {
    // In a real app with authentication, user would come from session.
    // Here, we simulate it from searchParams.
    const headersList = headers();
    const referer = headersList.get('referer');
    let user = null;
    let usernameParam = 'jdiaz'; // Default user

    if (referer) {
      try {
        const url = new URL(referer);
        const username = url.searchParams.get('user');
        if (username) {
            usernameParam = username;
        }
      } catch (e) {
        console.error("Could not parse referer URL", e)
      }
    }
    
    // Also check current URL in case of direct navigation
    const search = headersList.get('x-search');
    if (search) {
        try {
            const params = new URLSearchParams(search);
            const username = params.get('user');
            if (username) {
                usernameParam = username;
            }
        } catch(e) {
            console.error("Could not parse search params", e);
        }
    }
    
    user = await findUserByUsername(usernameParam);
    
    // If no user is found (e.g., direct navigation), redirect to login
    if (!user) {
        redirect('/login');
    }

    const initialData = await getInitialData();

    return (
        <AppLayoutClient user={user} initialData={initialData}>
            {children}
        </AppLayoutClient>
    );
}
