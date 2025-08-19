
import { redirect } from 'next/navigation';

export default function RootPage() {
  // La página raíz ahora simplemente redirige al dashboard principal de la aplicación.
  // Esto asegura que los usuarios siempre entren a través del layout correcto.
  redirect('/dashboard');
}
