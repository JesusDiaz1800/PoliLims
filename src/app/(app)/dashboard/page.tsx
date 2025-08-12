
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// This page acts as a redirect to the new main dashboard.
// It preserves the user from the query params if available, otherwise defaults.
export default function DashboardRedirectPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const username = searchParams?.user || 'main_dashboard_user';
  redirect(`/main?user=${username}`);
}

    