
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Bot, User } from "lucide-react";
import DOMPurify from 'dompurify';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === 'assistant';

    // Sanitize the HTML content from the assistant to prevent XSS attacks
    const sanitizedContent = isAssistant ? DOMPurify.sanitize(content) : content;

    return (
        <div className={cn(
            "flex items-start gap-4",
            isAssistant ? "" : "justify-end"
        )}>
            {isAssistant && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
            )}
            <div className={cn(
                "max-w-xl rounded-lg px-4 py-3 text-sm",
                isAssistant 
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
            )}>
               {isAssistant ? (
                 <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
               ) : (
                 <p>{content}</p>
               )}
            </div>
             {!isAssistant && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
