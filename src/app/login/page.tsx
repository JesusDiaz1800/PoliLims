
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
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-900 text-white">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 animate-gradient-xy" />
      <Card className="w-full max-w-md z-10 bg-black/30 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center space-y-4">
            <div className="mx-auto h-20 w-48">
                <Logo className="w-full h-full" />
            </div>
          <CardTitle className="text-3xl font-headline text-white">Bienvenido a PoliLIMS</CardTitle>
          <CardDescription className="text-gray-300">Ingrese sus credenciales para acceder al sistema de gestión del laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="nombre@polifusion.cl" required 
                     className="bg-black/20 border-primary/30 focus:ring-primary/80"/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                <Link href="#" className="text-sm text-primary/80 hover:text-primary hover:underline">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <Input id="password" type="password" required 
                     className="bg-black/20 border-primary/30 focus:ring-primary/80"/>
            </div>
            <Button type="submit" className="w-full !mt-8 h-11 text-base font-semibold bg-gradient-to-r from-primary to-blue-400 hover:from-primary/90 hover:to-blue-400/90 text-white shadow-lg shadow-primary/30 transition-all duration-300 transform hover:scale-105" asChild>
                <Link href="/dashboard">Ingresar al Sistema</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
