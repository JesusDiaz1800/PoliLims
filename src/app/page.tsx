
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the main dashboard, which is inside the (app) group
  redirect('/dashboard');
}
