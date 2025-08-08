
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Cloud, Database, KeyRound, Network, Users, GitBranch, FolderSync } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Próximos Pasos para Producción',
};

const StepCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
    const Icon = icon;
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <h3 className="text-lg font-semibold font-headline">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

export default function ProximosPasosPage() {
  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Guía para Poner en Marcha la Aplicación</CardTitle>
        <CardDescription>
            Para que esta aplicación pueda ser utilizada por todo tu equipo de forma segura y colaborativa, es fundamental dar los siguientes pasos en conjunto con el personal de TI de tu empresa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <StepCard 
            icon={Cloud}
            title="Despliegue en la Nube"
            description="La aplicación debe ser 'desplegada' en un servicio de hosting (como Firebase App Hosting o Vercel). Esto le dará una URL accesible para todos y garantizará que esté siempre disponible y actualizada."
        />
         <StepCard 
            icon={GitBranch}
            title="Estrategia de Despliegue (CI/CD)"
            description="La práctica recomendada es no desplegar manualmente desde un PC. TI debe conectar el repositorio de código (ej. GitHub) a Firebase App Hosting para crear un flujo de Despliegue Continuo (CI/CD). Así, cada nueva versión aprobada se despliega automáticamente, garantizando seguridad y trazabilidad."
        />
        <StepCard 
            icon={Users}
            title="Autenticación Segura de Usuarios"
            description="El sistema de login actual es solo para demostración. TI debe implementar un sistema de autenticación real, preferiblemente conectado al sistema de usuarios de la empresa (Ej. Active Directory) para que cada analista ingrese con su propio usuario y contraseña de forma segura."
        />
        <StepCard 
            icon={Database}
            title="Configurar una Base de Datos Central"
            description="Los datos actuales son de prueba. Dado que su empresa ya usa SQL, la opción ideal es que el equipo de TI cree un esquema para esta aplicación en su base de datos existente. Como alternativa inicial y gratuita, pueden configurar una base de datos Firestore (de Firebase), cuyo nivel gratuito es muy amplio."
        />
         <StepCard 
            icon={FolderSync}
            title="Almacenamiento de Archivos (PDFs)"
            description="Una aplicación web no puede guardar archivos directamente en una red local (Ej: unidad Y:\) por seguridad. La solución estándar es usar un servicio de almacenamiento en la nube como Firebase Storage. El equipo de TI puede configurar esto para que los informes generados se guarden de forma segura y centralizada."
        />
         <StepCard 
            icon={KeyRound}
            title="Gestión de Secretos y API Keys"
            description="La clave de la API de Gemini y otras credenciales deben ser gestionadas de forma segura a través de un sistema de 'secretos'. El equipo de TI tiene las herramientas para manejar esto y evitar exponer información sensible en el código."
        />
        <StepCard 
            icon={Network}
            title="Integración con Sistemas Internos"
            description="Si se necesita conectar la aplicación a otros sistemas de la empresa (como SAP), TI deberá configurar la red y los firewalls para permitir una comunicación segura entre los servicios."
        />
      </CardContent>
    </Card>
     <Card className="bg-green-500/10 border-green-500/20">
        <CardHeader className="flex flex-row items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
                <CardTitle>¡Has construido una base sólida!</CardTitle>
                <CardDescription className="text-green-900/80 dark:text-green-200/80">
                    Esta aplicación es un prototipo funcional avanzado. Presenta estos puntos a tu equipo de TI; ellos tendrán la experiencia para llevarla al siguiente nivel y convertirla en una herramienta de producción robusta para todo el laboratorio.
                </CardDescription>
            </div>
        </CardHeader>
    </Card>
    </div>
  );
}
