
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MessageSquarePlus, X } from "lucide-react";
import { SoporteChat } from "./soporte-chat";
import { cn } from "@/lib/utils";

interface ChatWidgetContextType {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isWidgetVisible: boolean;
    setIsWidgetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWidgetContext = React.createContext<ChatWidgetContextType | undefined>(undefined);

export const ChatWidgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isWidgetVisible, setIsWidgetVisible] = React.useState(true);
    return (
        <ChatWidgetContext.Provider value={{ isOpen, setIsOpen, isWidgetVisible, setIsWidgetVisible }}>
            {children}
        </ChatWidgetContext.Provider>
    )
}

export const useChatWidget = () => {
    const context = React.useContext(ChatWidgetContext);
    if(!context) {
        throw new Error("useChatWidget must be used within a ChatWidgetProvider");
    }
    return context;
}

export function ChatWidget() {
  const { isOpen, setIsOpen, isWidgetVisible, setIsWidgetVisible } = useChatWidget();

  return (
    <>
      <div className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center gap-2 transition-opacity duration-300",
        isWidgetVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <Button
          onClick={() => setIsWidgetVisible(false)}
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Ocultar chat</span>
        </Button>
        <Button
            onClick={() => setIsOpen(true)}
            size="icon"
            className="h-14 w-14 rounded-full text-white bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-500 hover:to-blue-700 shadow-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
        >
            <MessageSquarePlus className="h-7 w-7" />
            <span className="sr-only">Abrir Chat de Soporte</span>
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[440px] sm:w-[540px] p-0 flex flex-col h-full">
          <SheetHeader className="p-4 border-b text-left">
            <SheetTitle>Asistente de Soporte</SheetTitle>
            <SheetDescription>
              Resuelve dudas sobre procedimientos y diagnostica problemas del laboratorio.
            </SheetDescription>
          </SheetHeader>
          <SoporteChat />
        </SheetContent>
      </Sheet>
    </>
  );
}
