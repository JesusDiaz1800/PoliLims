
"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === 'assistant';
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
                "max-w-xl rounded-lg px-4 py-3 text-sm prose",
                isAssistant 
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
            )}>
               <ReactMarkdown
                 components={{
                     p: ({ node, ...props }) => <p className="my-2" {...props} />,
                     ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                     li: ({ node, ...props }) => <li className="my-1" {...props} />,
                 }}
               >
                   {content}
                </ReactMarkdown>
            </div>
             {!isAssistant && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
