
import { DocumentosTable } from '@/components/biblioteca/documentos-table';
import type { Metadata } from 'next';
import { getKnowledgeBaseFiles } from '@/services/server-data-service';
import { UploadForm } from '@/components/biblioteca/upload-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, Library } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gestor Documental',
};

// Revalidate every 60 seconds to pick up new files
export const revalidate = 60;

export default async function DocumentosPage() {
  const files = await getKnowledgeBaseFiles();
  
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <DocumentosTable files={files} />
      </div>
      <div>
        <Card>
            <CardHeader>
                <div className='flex items-center gap-4'>
                    <UploadCloud className='h-8 w-8 text-primary'/>
                    <div>
                        <CardTitle>Cargar Documento</CardTitle>
                        <CardDescription>
                            Añada nuevos archivos (.txt) a la base de conocimiento.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <UploadForm />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    