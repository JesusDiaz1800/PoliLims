
import { redirect } from 'next/navigation';

// This page acts as a base route for the "Administración" sidebar group.
// It redirects to the first item in the group.
export default function AdminPage() {
  redirect('/admin/usuarios');
}
