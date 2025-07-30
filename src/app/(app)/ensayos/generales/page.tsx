import { redirect } from 'next/navigation';

// Esta página ya no es necesaria, ya que los ensayos generales
// se registran directamente en el formulario de Control Rutinario.
export default function EnsayosGeneralesPage() {
  redirect('/ensayos/control-rutinario');
}
