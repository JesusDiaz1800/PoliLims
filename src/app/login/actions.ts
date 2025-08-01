
'use server';

import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const username = email.split('@')[0];
  redirect(`/dashboard?user=${username}`);
}
