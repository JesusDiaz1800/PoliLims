import { getInitialData } from '@/services/data-service';
import AppLayoutClient from './app-layout-client';
import { DynamicDataProvider } from '@/context/data-context';
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
    if (referer) {
      try {
        const url = new URL(referer);
        const username = url.searchParams.get('user');
        if (username) {
            user = await findUserByUsername(username);
        }
      } catch (e) {
        console.error("Could not parse referer URL", e)
      }
    }
    
    // If no user is found (e.g., direct navigation), redirect to login
    if (!user) {
        const defaultUser = await findUserByUsername('jdiaz');
        if (!defaultUser) {
           redirect('/login');
        }
        user = defaultUser;
    }

    const initialData = await getInitialData();

    return (
        <DynamicDataProvider initialData={initialData}>
            <AppLayoutClient user={user}>
                {children}
            </AppLayoutClient>
        </DynamicDataProvider>
    );
}
