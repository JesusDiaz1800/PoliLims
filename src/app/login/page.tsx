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
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
       <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
       <div className="absolute inset-0 -z-20 h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.3),rgba(255,255,255,0))]"></div>
      
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-primary/20 shadow-glow">
        <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-24 w-56">
                <Logo className="w-full h-full" />
            </div>
          <CardTitle className="text-3xl font-headline text-foreground">Bienvenido a PoliLIMS</CardTitle>
          <CardDescription>Ingrese sus credenciales para acceder al sistema de gestión del laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="nombre@polifusion.cl" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
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
