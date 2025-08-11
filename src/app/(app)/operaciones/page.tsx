
import { redirect } from 'next/navigation';

// This page acts as a base route for the "Operaciones" sidebar group.
// It redirects to the first item in the group, 'Control de Importaciones'.
export default function OperacionesPage() {
  redirect('/importaciones');
}

    