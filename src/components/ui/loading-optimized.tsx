"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LogoAlt } from '@/components/logo-alt';

const loadingMessages = [
    "Cargando componentes...",
    "Analizando datos del laboratorio...",
    "Calibrando instrumentos virtuales...",
    "Optimizando visualizaciones...",
    "Poniendo todo a punto...",
];

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const LoadingSpinner = React.memo(({ size = "md", className }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24", 
        lg: "w-32 h-32"
    };

    const logoSizeClasses = {
        sm: "w-10 h-10",
        md: "w-16 h-16",
        lg: "w-20 h-20"
    };

    return (
        <div className={cn("relative", sizeClasses[size], className)}>
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div 
                className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={logoSizeClasses[size]}>
                    <LogoAlt className="text-primary"/>
                </div>
            </div>
        </div>
    );
});

LoadingSpinner.displayName = "LoadingSpinner";

interface LoadingProps {
    variant?: "fullscreen" | "inline" | "overlay";
    size?: "sm" | "md" | "lg";
    message?: string;
    showMessages?: boolean;
    className?: string;
}

const Loading = React.memo(({ 
    variant = "fullscreen", 
    size = "md",
    message,
    showMessages = true,
    className 
}: LoadingProps) => {
    const [messageIndex, setMessageIndex] = React.useState(0);
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
        
        if (showMessages && !message) {
            const interval = setInterval(() => {
                setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
            }, 2000);
            
            return () => clearInterval(interval);
        }
    }, [showMessages, message]);

    const currentMessage = message || (isClient ? loadingMessages[messageIndex] : loadingMessages[0]);

    const variants = {
        fullscreen: "flex flex-1 items-center justify-center h-screen bg-background",
        inline: "flex items-center justify-center min-h-[200px]",
        overlay: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    };

    return (
        <div className={cn(variants[variant], className)}>
            <div className="flex flex-col items-center gap-6 text-center animate-in fade-in-50">
                <LoadingSpinner size={size} />
                <div>
                    <p className="text-xl font-semibold font-headline text-foreground">
                        {currentMessage}
                    </p>
                    <p className="text-muted-foreground">Por favor, espere un momento.</p>
                </div>
            </div>
        </div>
    );
});

Loading.displayName = "Loading";

// Componente de carga rápida para navegación
export const QuickLoading = React.memo(() => {
    return (
        <div className="flex items-center justify-center min-h-[100px]">
            <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="sm" />
                <p className="text-sm text-muted-foreground">Cargando...</p>
            </div>
        </div>
    );
});

QuickLoading.displayName = "QuickLoading";

// Componente de carga con overlay
export const LoadingOverlay = React.memo(({ 
    isVisible, 
    children,
    ...props 
}: LoadingProps & { isVisible: boolean; children: React.ReactNode }) => {
    if (!isVisible) return <>{children}</>;

    return (
        <div className="relative">
            {children}
            <Loading variant="overlay" {...props} />
        </div>
    );
});

LoadingOverlay.displayName = "LoadingOverlay";

export { Loading, LoadingSpinner };
export default Loading;
