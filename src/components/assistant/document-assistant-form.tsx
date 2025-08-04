
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getDocumentSuggestion } from '@/app/(app)/document-assistant/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2, FileQuestion } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialState = { message: '', data: null, error: null, fieldErrors: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                </>
            ) : (
                <>
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Preguntar al Asistente
                </>
            )}
        </Button>
    );
}

export function DocumentAssistantForm() {
    const [state, formAction] = useActionState(getDocumentSuggestion, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === "Failed to get suggestion from AI.") {
            toast({
                variant: "destructive",
                title: "Error de IA",
                description: state.error || "Ocurrió un error desconocido.",
            });
        }
    }, [state, toast]);


    return (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Consulta</CardTitle>
                    <CardDescription>Haz una pregunta específica sobre un procedimiento o un dato técnico. La IA buscará en la base de conocimiento para responderte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Tu Pregunta</Label>
                            <Textarea
                                id="prompt"
                                name="prompt"
                                placeholder="Ejemplo: '¿A qué temperatura se debe realizar el ensayo de melt index para el polietileno?'..."
                                rows={6}
                                required
                                className="bg-background"
                            />
                            {state.fieldErrors?.prompt && (
                                <p className="text-sm text-destructive">{state.fieldErrors.prompt[0]}</p>
                            )}
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>

            {state.data && (
                <Card className="mt-8 animate-in fade-in">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <CardTitle>Respuesta del Asistente</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-secondary p-4 rounded-md space-y-4">
                            <p className="text-sm text-secondary-foreground whitespace-pre-wrap">
                                {state.data.response}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
