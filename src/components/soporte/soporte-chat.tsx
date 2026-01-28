
"use client";

import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '../ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatInputForm } from './chat-input-form';
import { WelcomeMessage } from './welcome-message';
import { Button } from '../ui/button';
import { SheetClose } from '../ui/sheet';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLabAssistantResponse } from '@/services/ai-service';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function SoporteChat() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const prompt = formData.get('prompt') as string;
        if (!prompt || isLoading) return;

        setIsLoading(true);
        const userMessage = { role: 'user' as const, content: prompt };
        setHistory(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await getLabAssistantResponse(prompt);
            
            if (response.success && response.data) {
                const assistantMessage = { role: 'assistant' as const, content: response.data };
                setHistory(prev => [...prev, assistantMessage]);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error de IA",
                    description: "No se pudo obtener una respuesta del asistente.",
                });
                // Remove the last user message if AI fails
                setHistory(prev => prev.slice(0, -1));
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error de IA",
                description: "Ocurrió un error al procesar tu solicitud.",
            });
            // Remove the last user message if AI fails
            setHistory(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptClick = (promptText: string) => {
        setInput(promptText);
        // Focus the textarea after setting the value
        setTimeout(() => {
            formRef.current?.querySelector('textarea')?.focus();
        }, 0);
    };
    
    // Scroll to bottom when history changes
    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [history]);

    return (
        <div className="flex flex-col flex-grow bg-card h-full">
            <ScrollArea className="flex-grow p-4 space-y-4 custom-scrollbar" ref={scrollAreaRef}>
                {history.length === 0 ? (
                    <WelcomeMessage onPromptClick={handlePromptClick} />
                ) : (
                    <div className="space-y-6">
                        {history.map((msg, index) => (
                            <ChatMessage key={index} role={msg.role} content={msg.content} />
                        ))}
                        {isLoading && (
                            <ChatMessage 
                                role="assistant" 
                                content="Pensando..." 
                            />
                        )}
                    </div>
                )}
            </ScrollArea>
            <ChatInputForm 
                formRef={formRef}
                formAction={handleSubmit} 
                history={history}
                input={input}
                onInputChange={setInput}
                isPending={isLoading}
            />
            <div className="p-4 border-t bg-background">
                <SheetClose asChild>
                    <Button variant="outline" className="w-full">Cerrar</Button>
                </SheetClose>
            </div>
        </div>
    );
}
