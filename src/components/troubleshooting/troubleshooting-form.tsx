
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getTroubleshootingSuggestion } from '@/app/(app)/troubleshooting/actions';
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
                    Analizando...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Obtener Sugerencia
                </>
            )}
        </Button>
    );
}

export function TroubleshootingForm() {
    const [state, formAction] = useActionState(getTroubleshootingSuggestion, initialState);
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
                    <CardTitle>Describa el Problema</CardTitle>
                    <CardDescription>Proporcione el mensaje de error y describa qué estaba haciendo cuando ocurrió. El sistema analizará el problema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="errorMessage">Mensaje de Error</Label>
                            <Textarea
                                id="errorMessage"
                                name="errorMessage"
                                placeholder="Pegue el mensaje de error completo aquí..."
                                rows={4}
                                required
                                className="bg-background"
                            />
                            {state.fieldErrors?.errorMessage && (
                                <p className="text-sm text-destructive">{state.fieldErrors.errorMessage[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="usagePatterns">Patrones de Uso</Label>
                            <Textarea
                                id="usagePatterns"
                                name="usagePatterns"
                                placeholder="Describa los pasos que siguió, el equipo utilizado y cualquier observación inusual..."
                                rows={6}
                                required
                                className="bg-background"
                            />
                             {state.fieldErrors?.usagePatterns && (
                                <p className="text-sm text-destructive">{state.fieldErrors.usagePatterns[0]}</p>
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
                            <CardTitle>Análisis y Sugerencias</CardTitle>
                        </div>
                        <CardDescription>Este es el análisis del asistente de diagnóstico.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold font-headline mb-2">Identificación del Problema</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{state.data.problemIdentification}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold font-headline mb-2">Soluciones Sugeridas</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md whitespace-pre-wrap">{state.data.suggestedSolutions}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold font-headline mb-2">Documentación Relevante</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{state.data.relevantDocumentation}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
