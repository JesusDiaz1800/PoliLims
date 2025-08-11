
import { redirect } from 'next/navigation';

// This page acts as a base route for the "Procesos de Gestión" sidebar group.
// It redirects to the first item in the group, 'Inventario de Equipos'.
export default function GestionPage() {
  redirect('/equipos');
}

    