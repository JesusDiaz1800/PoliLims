
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getCodeSuggestion } from '@/app/(app)/assistant/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialState = { message: '', data: null, error: null, fieldErrors: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generar Respuesta
                </>
            )}
        </Button>
    );
}

export function AssistantForm() {
    const [state, formAction] = useActionState(getCodeSuggestion, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === "Failed to get suggestion from AI.") {
            toast({
                variant: "destructive",
                title: "Error de Sistema",
                description: state.error || "Ocurrió un error desconocido.",
            });
        }
    }, [state, toast]);


    return (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Nueva Solicitud</CardTitle>
                    <CardDescription>Describe tu solicitud en detalle. Puedes pedir componentes de React, funciones de TypeScript, correcciones de errores, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="prompt">Tu Solicitud</Label>
                            <Textarea
                                id="prompt"
                                name="prompt"
                                placeholder="Ejemplo: 'Crea un componente de tarjeta de perfil de usuario con una foto, nombre, y rol usando ShadCN y Tailwind CSS'..."
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
                            <CardTitle>Respuesta Generada</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-secondary p-4 rounded-md overflow-x-auto">
                            <code className="text-sm text-secondary-foreground font-mono">
                                {state.data.response.replace(/```(typescript|javascript|jsx|tsx)?\n?|```/g, '')}
                            </code>
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
