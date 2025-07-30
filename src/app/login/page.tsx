
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Iniciar Sesión | PoliLIMS',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/10">
        <CardHeader className="text-center space-y-4">
            <div className="flex justify-center items-center">
                <Logo className="h-16 w-auto text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline">Bienvenido a PoliLIMS</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema de gestión del laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="nombre@polifusion.cl" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary/80 hover:text-primary hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full !mt-8 h-11 text-base font-semibold" asChild>
                <Link href="/dashboard">Ingresar al Sistema</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
