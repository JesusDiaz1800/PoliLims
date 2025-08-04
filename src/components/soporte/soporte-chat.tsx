
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { getDocumentSuggestion } from '@/app/(app)/document-assistant/actions';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '../ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatInputForm } from './chat-input-form';
import { WelcomeMessage } from './welcome-message';


export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

const initialState = { message: '', data: null, error: null, fieldErrors: null };

export function SoporteChat() {
    const [state, formAction] = useActionState(getDocumentSuggestion, initialState);
    const { toast } = useToast();
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.message === "Failed to get suggestion from AI.") {
            toast({
                variant: "destructive",
                title: "Error de IA",
                description: state.error || "Ocurrió un error desconocido.",
            });
            // Remove the last user message if AI fails
             setHistory(prev => prev.slice(0, -1));
        } else if (state.data?.response) {
            setHistory(prev => [...prev, { role: 'assistant', content: state.data.response }]);
        }
    }, [state, toast]);
    
    const handleFormAction = (formData: FormData) => {
        const prompt = formData.get('prompt') as string;
        if (prompt) {
            setHistory(prev => [...prev, { role: 'user', content: prompt }]);
            formAction(formData);
            // Reset the form manually after submitting
            const form = document.querySelector('form');
            form?.reset();
        }
    };
    
    // Scroll to bottom when history changes
    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [history]);

    return (
        <div className="flex flex-col flex-grow border rounded-lg bg-card">
            <ScrollArea className="flex-grow p-4 space-y-4" viewportRef={viewportRef}>
                {history.length === 0 ? (
                    <WelcomeMessage />
                ) : (
                    <div className="space-y-6">
                        {history.map((msg, index) => (
                            <ChatMessage key={index} role={msg.role} content={msg.content} />
                        ))}
                    </div>
                )}
            </ScrollArea>
            <ChatInputForm formAction={handleFormAction} history={history} />
        </div>
    );
}
