
"use client";

import * as React from 'react';
import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadDocument } from '@/app/(app)/biblioteca/upload/actions';
import { Loader2, Upload, Info, FolderGit2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle } from 'lucide-react';


const initialState = { message: '', error: null, fieldErrors: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                </>
            ) : (
                <>
                    <Upload className="mr-2 h-4 w-4" />
                    Cargar Archivo
                </>
            )}
        </Button>
    );
}

export function UploadForm() {
    const [state, formAction] = useActionState(uploadDocument, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to show toast messages based on the form state
    React.useEffect(() => {
        if (state.message === "Error al cargar el archivo.") {
            toast({
                variant: "destructive",
                title: "Error de Carga",
                description: state.error || "Ocurrió un error desconocido.",
            });
        }
        if (state.message === "Archivo cargado con éxito.") {
            toast({
                variant: "default",
                title: "Éxito",
                description: "El archivo se ha añadido a la base de conocimiento y está listo para revisión.",
            });
            // Reset the form on success
            formRef.current?.reset();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [state, toast]);

    return (
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="file">Seleccionar Archivo</Label>
                <Input id="file" name="file" type="file" required ref={fileInputRef}/>
                {state.fieldErrors?.file && (
                    <p className="text-sm text-destructive mt-1">{state.fieldErrors.file[0]}</p>
                )}
            </div>

            <div className='flex items-center justify-between'>
                <SubmitButton />
                 {state.message === "Archivo cargado con éxito." && (
                    <div className='flex items-center gap-2 text-green-600 animate-in fade-in'>
                        <CheckCircle className='h-4 w-4'/>
                        <span className='text-sm font-medium'>¡Cargado con éxito!</span>
                    </div>
                 )}
            </div>
            
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Recomendación para Asistente de IA</AlertTitle>
                <AlertDescription>
                   Para mejores resultados con el Asistente, prefiera archivos de texto plano (.txt) con una estructura clara. Si su documento está en otro formato (PDF, Word), simplemente copie el texto y péguelo en un nuevo archivo .txt antes de subirlo.
                </AlertDescription>
            </Alert>
            <Alert>
                <FolderGit2 className="h-4 w-4" />
                <AlertTitle>Conexión a Carpetas de Red (Producción)</AlertTitle>
                <AlertDescription>
                    Este prototipo simula la carga de archivos. En un entorno de producción, el sistema se conectará directamente a las carpetas de red de la empresa (Ej: `\\SERVIDOR\Calidad\Documentos`) para leer y versionar los archivos existentes sin necesidad de subirlos manualmente.
                </AlertDescription>
            </Alert>
        </form>
    );
}
