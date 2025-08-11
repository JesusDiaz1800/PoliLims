
import { redirect } from 'next/navigation';

// This page acts as a base route for the "Procesos de Gestión" sidebar group.
// It redirects to the first item in the group.
export default function ProcesosPage() {
  redirect('/procesos/equipos/lista');
}
