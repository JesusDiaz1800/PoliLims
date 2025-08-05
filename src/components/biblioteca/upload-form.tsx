
"use client";

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadDocument } from '@/app/(app)/biblioteca/upload/actions';
import { Loader2, Upload } from 'lucide-react';
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
                description: "El archivo se ha añadido a la base de conocimiento.",
            });
            // Reset the form on success
            formRef.current?.reset();
        }
    }, [state, toast]);

    return (
        <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="file">Seleccionar Archivo (.txt)</Label>
                <Input id="file" name="file" type="file" accept=".txt" required />
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
                <AlertTitle>Recomendación</AlertTitle>
                <AlertDescription>
                    Para mejores resultados con la IA, asegúrese de que sus archivos de texto tengan una estructura clara. Utilice títulos, subtítulos, listas y párrafos bien definidos para facilitar la búsqueda de información.
                </AlertDescription>
            </Alert>
        </form>
    );
}
