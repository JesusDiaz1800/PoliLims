

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
import { MessageSquarePlus } from "lucide-react";
import { SoporteChat } from "./soporte-chat";

interface ChatWidgetContextType {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWidgetContext = React.createContext<ChatWidgetContextType | undefined>(undefined);

export const ChatWidgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <ChatWidgetContext.Provider value={{ isOpen, setIsOpen }}>
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
  const { isOpen, setIsOpen } = useChatWidget();

  return (
    <>
      <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
          <MessageSquarePlus className="h-7 w-7" />
          <span className="sr-only">Abrir Chat de Soporte</span>
      </Button>
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
