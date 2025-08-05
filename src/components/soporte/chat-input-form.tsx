
"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Input } from '../ui/input';
import type { ChatMessage } from './soporte-chat';
import type { FormEvent } from 'react';

interface SubmitButtonProps {
    isPending: boolean;
}

function SubmitButton({ isPending }: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={isPending} size="icon">
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Enviar mensaje</span>
        </Button>
    );
}

interface ChatInputFormProps {
    formRef: React.RefObject<HTMLFormElement>;
    formAction: (formData: FormData) => void;
    history: ChatMessage[];
    input: string;
    onInputChange: (value: string) => void;
    isPending: boolean;
}

export function ChatInputForm({ formRef, formAction, history, input, onInputChange, isPending }: ChatInputFormProps) {
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formAction(formData);
    }
    
    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-center gap-4 p-4 border-t bg-background"
        >
            <Textarea
                name="prompt"
                placeholder="Pregunta sobre un procedimiento..."
                rows={1}
                required
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                className="flex-1 resize-none bg-background focus-visible:ring-1 focus-visible:ring-ring"
                 onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        formRef.current?.requestSubmit();
                    }
                }}
            />
            <Input type="hidden" name="history" value={JSON.stringify(history)} />
            <SubmitButton isPending={isPending} />
        </form>
    );
}
