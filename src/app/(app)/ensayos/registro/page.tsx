import { redirect } from 'next/navigation';

// Redirect to the main dashboard or a more specific page 
// as a generic registration form is no longer needed.
export default function RegistrarEnsayoPage() {
  redirect('/dashboard');
}
