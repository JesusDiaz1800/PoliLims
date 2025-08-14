

"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TuberiasHdpeForm } from "@/components/ensayos/tuberias/tuberias-hdpe-form";
import { TuberiasPpForm } from "@/components/ensayos/tuberias/tuberias-pp-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDynamicData, type Ensayo } from "@/context/data-context";
import type { User } from "@/services/user-service";

interface EnsayoProductoTerminadoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo;
  tipo: "HDPE" | "PP";
  user: User;
  defaultTab?: string;
}

export function EnsayoProductoTerminadoDialog({ isOpen, onClose, ensayo, tipo, user, defaultTab = 'all' }: EnsayoProductoTerminadoDialogProps) {
  const { equipos } = useDynamicData();

  const analistas = [
      { value: "jesus.diaz", label: "Jesus Diaz" },
      { value: "maximiliano.miranda", label: "Maximiliano Miranda" },
      { value: "antonia.figueroa", label: "Antonia Figueroa" },
      { value: "robinson.cordova", label: "Robinson Córdova" },
      { value: "bryan.vasquez", label: "Bryan Vásquez" },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Ingresar Resultados de Ensayo: Tubería {tipo}</DialogTitle>
          <DialogDescription>
            Complete los campos con los resultados obtenidos en el laboratorio para la muestra <span className="font-mono font-bold text-foreground">{ensayo.id}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto custom-scrollbar px-6 pb-6">
          {tipo === 'HDPE' ? (
            <TuberiasHdpeForm analistas={analistas} ensayo={ensayo} onFormSubmit={onClose} equipos={equipos} user={user} defaultTab={defaultTab} />
          ) : (
            <TuberiasPpForm analistas={analistas} ensayo={ensayo} onFormSubmit={onClose} equipos={equipos} user={user} defaultTab={defaultTab}/>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
