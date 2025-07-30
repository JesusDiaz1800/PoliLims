"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getTroubleshootingSuggestion } from '@/app/(app)/troubleshooting/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const initialState = { message: '', data: null, error: null, fieldErrors: null };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Get Suggestion
                </>
            )}
        </Button>
    );
}

export function TroubleshootingForm() {
    const [state, formAction] = useFormState(getTroubleshootingSuggestion, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message === "Failed to get suggestion from AI.") {
            toast({
                variant: "destructive",
                title: "AI Error",
                description: state.error || "An unknown error occurred.",
            });
        }
    }, [state, toast]);


    return (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Describe the Issue</CardTitle>
                    <CardDescription>Provide the error message and describe what you were doing when the error occurred. Our AI will analyze the problem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="errorMessage">Error Message</Label>
                            <Textarea
                                id="errorMessage"
                                name="errorMessage"
                                placeholder="Paste the full error message here..."
                                rows={4}
                                required
                                className="bg-background"
                            />
                            {state.fieldErrors?.errorMessage && (
                                <p className="text-sm text-destructive">{state.fieldErrors.errorMessage[0]}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="usagePatterns">Usage Patterns</Label>
                            <Textarea
                                id="usagePatterns"
                                name="usagePatterns"
                                placeholder="Describe the steps you took, the instrument used, and any unusual observations..."
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
                            <CardTitle>AI Analysis & Suggestions</CardTitle>
                        </div>
                        <CardDescription>Here is the analysis from our AI assistant.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold font-headline mb-2">Problem Identification</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{state.data.problemIdentification}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold font-headline mb-2">Suggested Solutions</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md whitespace-pre-wrap">{state.data.suggestedSolutions}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold font-headline mb-2">Relevant Documentation</h3>
                            <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-md">{state.data.relevantDocumentation}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
