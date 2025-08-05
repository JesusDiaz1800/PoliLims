
"use client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageSquarePlus } from "lucide-react";
import { SoporteChat } from "./soporte-chat";

export function ChatWidget() {
  return (
    <Sheet>
      <SheetTrigger asChild>
         <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
         >
            <MessageSquarePlus className="h-7 w-7" />
            <span className="sr-only">Abrir Chat de Soporte</span>
         </Button>
      </SheetTrigger>
      <SheetContent className="w-[440px] sm:w-[540px] p-0 border-none">
        <SoporteChat />
      </SheetContent>
    </Sheet>
  );
}
