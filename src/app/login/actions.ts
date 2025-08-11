
'use server';

import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  // En una aplicación real, aquí se validaría la contraseña y se obtendría el usuario.
  // Para el prototipo, extraemos el nombre de usuario del correo.
  const username = email.split('@')[0].toLowerCase();
  redirect(`/dashboard?user=${username}`);
}
