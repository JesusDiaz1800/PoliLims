import { redirect } from 'next/navigation';

export default function DashboardPage() {
    // En un sistema real, aquí habría una lógica para determinar el rol del usuario.
    // Para esta demo, asumimos que el usuario es un inspector y lo redirigimos
    // a la única pantalla que tiene asignada.
    redirect('/ensayos/control-rutinario');
}
