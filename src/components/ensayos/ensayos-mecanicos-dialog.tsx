
"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { FilePlus2 } from "lucide-react"
import { Separator } from "../ui/separator"

interface EnsayosMecanicosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayoId: string;
}

const formSchema = z.object({
  tipoEnsayo: z.enum(["contraccion", "impacto", "phi"]),
  contraccion1: z.number().optional(),
  contraccion2: z.number().optional(),
  impactoFallas: z.number().optional(),
  impactoTotal: z.number().optional(),
  phiSinFallas: z.boolean().optional(),
});

export function EnsayosMecanicosDialog({ isOpen, onClose, ensayoId }: EnsayosMecanicosDialogProps) {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoEnsayo: "contraccion",
            impactoTotal: 4,
        }
    });

    const tipoEnsayo = form.watch("tipoEnsayo");

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log({ ensayoId, ...data });
        toast({
            title: "Ensayos Guardados",
            description: `Los resultados para la muestra ${ensayoId} han sido guardados.`,
        });
        onClose();
        form.reset();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Registrar Ensayos Mecánicos</DialogTitle>
                        <DialogDescription>
                           Añada los resultados de los ensayos para la muestra <span className="font-bold font-mono text-foreground">{ensayoId}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                         <Controller
                            control={form.control}
                            name="tipoEnsayo"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-8"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="contraccion" id="contraccion" />
                                        <Label htmlFor="contraccion" className="font-normal">Contracción Longitudinal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="impacto" id="impacto" />
                                        <Label htmlFor="impacto" className="font-normal">Resistencia al Impacto</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="phi" id="phi" />
                                        <Label htmlFor="phi" className="font-normal">Resistencia a Presión Hidrostática (PHI)</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        
                        <Separator />

                        {tipoEnsayo === 'contraccion' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                                <div className="space-y-2">
                                    <Label htmlFor="contraccion1">Medición 1 [%]</Label>
                                    <Input id="contraccion1" type="number" step="any" {...form.register("contraccion1", { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contraccion2">Medición 2 [%]</Label>
                                    <Input id="contraccion2" type="number" step="any" {...form.register("contraccion2", { valueAsNumber: true })} />
                                </div>
                            </div>
                        )}

                        {tipoEnsayo === 'impacto' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                                <div className="space-y-2">
                                    <Label htmlFor="impactoFallas">N° de Fallas</Label>
                                    <Input id="impactoFallas" type="number" {...form.register("impactoFallas", { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="impactoTotal">N° Total de Muestras</Label>
                                    <Input id="impactoTotal" type="number" {...form.register("impactoTotal", { valueAsNumber: true })} />
                                </div>
                            </div>
                        )}

                        {tipoEnsayo === 'phi' && (
                            <div className="animate-in fade-in">
                                <div className="flex items-center space-x-2">
                                    <Controller
                                        control={form.control}
                                        name="phiSinFallas"
                                        render={({ field }) => (
                                            <Checkbox
                                                id="phiSinFallas"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="phiSinFallas" className="font-normal">
                                        Sin fallas a la presión y tiempo establecidos por norma
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                         <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                         <Button type="submit">
                            <FilePlus2 className="mr-2 h-4 w-4" />
                            Guardar Resultados
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

