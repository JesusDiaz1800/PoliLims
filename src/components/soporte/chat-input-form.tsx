
"use client";

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { Input } from '../ui/input';
import type { ChatMessage } from './soporte-chat';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="icon">
            {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Enviar mensaje</span>
        </Button>
    );
}


interface ChatInputFormProps {
    formAction: (formData: FormData) => void;
    history: ChatMessage[];
}

export function ChatInputForm({ formAction, history }: ChatInputFormProps) {
    return (
        <form
            action={formAction}
            className="flex items-center gap-4 p-4 border-t bg-background"
        >
            <Textarea
                name="prompt"
                placeholder="Pregunta sobre un procedimiento..."
                rows={1}
                required
                className="flex-1 resize-none bg-background focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Input type="hidden" name="history" value={JSON.stringify(history)} />
            <SubmitButton />
        </form>
    );
}

