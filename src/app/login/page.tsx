
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { Metadata } from 'next';
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Iniciar Sesión | PoliLIMS',
};

export default function LoginPage() {

  async function handleLogin(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const username = email.split('@')[0];
    redirect(`/dashboard?user=${username}`);
  }


  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
       <div className="absolute inset-0 -z-10 h-full w-full bg-card dark:bg-gray-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
       
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4 pt-8">
            <div className="mx-auto h-16 w-48">
            </div>
          <CardTitle className="text-3xl font-headline">Bienvenido a PoliLIMS</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema de gestión del laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input name="email" id="email" type="email" placeholder="nombre.apellido@polifusion.cl" required defaultValue="jesus.diaz@polifusion.cl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <Input name="password" id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full !mt-8 h-11 text-base font-semibold">
                Ingresar al Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
