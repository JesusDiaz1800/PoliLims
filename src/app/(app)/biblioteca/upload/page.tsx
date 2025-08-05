
import { UploadForm } from '@/components/biblioteca/upload-form';
import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cargar Documento',
};

export default function UploadPage() {
  return (
    <Card>
        <CardHeader>
            <div className='flex items-center gap-4'>
                <UploadCloud className='h-8 w-8 text-primary'/>
                <div>
                    <CardTitle>Cargar Documento a la Base de Conocimiento</CardTitle>
                    <CardDescription>
                        Añada nuevos procedimientos, manuales o normas (.txt) para que el Asistente de IA pueda consultarlos.
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <UploadForm />
        </CardContent>
    </Card>
  );
}
