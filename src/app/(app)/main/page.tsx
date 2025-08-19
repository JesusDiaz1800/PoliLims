
import { redirect } from 'next/navigation';

// This page is deprecated in favor of /dashboard
export default function MainPage() {
  redirect('/dashboard');
}
