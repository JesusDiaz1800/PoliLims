
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Capacitacion } from "@/context/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface EvaluacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  capacitacion: Capacitacion;
  onSave: (id: string, data: Partial<Capacitacion>) => Promise<void>;
}

export function EvaluacionDialog({ isOpen, onClose, capacitacion, onSave }: EvaluacionDialogProps) {
  const { toast } = useToast();
  const [preguntas, setPreguntas] = React.useState(capacitacion.evaluacion?.preguntas || []);

  React.useEffect(() => {
    if (isOpen) {
      setPreguntas(capacitacion.evaluacion?.preguntas || []);
    }
  }, [isOpen, capacitacion.evaluacion]);

  const handleAddPregunta = () => {
    setPreguntas([...preguntas, { pregunta: '' }]);
  };

  const handlePreguntaChange = (index: number, value: string) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index].pregunta = value;
    setPreguntas(nuevasPreguntas);
  };
  
  const handleRemovePregunta = (index: number) => {
    const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevasPreguntas);
  }

  const handleSave = async () => {
    try {
        const evaluacionData = {
            ...capacitacion.evaluacion,
            id: capacitacion.evaluacion?.id || `EVAL-${capacitacion.id}`,
            preguntas,
            resultados: capacitacion.evaluacion?.resultados || [],
        };
        await onSave(capacitacion.id, { evaluacion: evaluacionData });
        toast({ title: "Evaluación guardada", description: "El cuestionario de evaluación ha sido actualizado." });
        onClose();
    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "No se pudo guardar la evaluación." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gestionar Evaluación: {capacitacion.nombre}</DialogTitle>
          <DialogDescription>
            Cree o edite las preguntas para la evaluación de esta capacitación.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <Button variant="outline" size="sm" onClick={handleAddPregunta}>
                <PlusCircle className="mr-2 h-4 w-4"/> Añadir Pregunta
            </Button>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
                <div className="space-y-4">
                {preguntas.map((p, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Label htmlFor={`pregunta-${index}`} className="flex-shrink-0">P{index + 1}.</Label>
                        <Input 
                            id={`pregunta-${index}`}
                            value={p.pregunta}
                            onChange={(e) => handlePreguntaChange(index, e.target.value)}
                            placeholder="Escriba el texto de la pregunta..."
                        />
                        <Button variant="ghost" size="icon" onClick={() => handleRemovePregunta(index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                    </div>
                ))}
                {preguntas.length === 0 && <p className="text-muted-foreground text-center">No hay preguntas definidas.</p>}
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4"/> Guardar Evaluación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
