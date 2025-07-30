
"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { FilePlus2 } from "lucide-react"

const formSchema = z.object({
  tipoEnsayo: z.enum(["contraccion", "impacto", "phi"]),
  contraccion1: z.number().optional(),
  contraccion2: z.number().optional(),
  impactoFallas: z.number().optional(),
  impactoTotal: z.number().optional(),
  phiSinFallas: z.boolean().optional(),
});

export function EnsayosGeneralesForm() {
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
        console.log(data);
        toast({
            title: "Ensayo Guardado",
            description: "El resultado del ensayo ha sido guardado exitosamente.",
        });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Seleccionar Ensayo a Registrar</CardTitle>
                </CardHeader>
                <CardContent>
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
                                    <Label htmlFor="contraccion" className="text-base">Contracción Longitudinal</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="impacto" id="impacto" />
                                    <Label htmlFor="impacto" className="text-base">Resistencia al Impacto</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="phi" id="phi" />
                                    <Label htmlFor="phi" className="text-base">Resistencia a Presión Hidrostática (PHI)</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </CardContent>
            </Card>

            {tipoEnsayo === 'contraccion' && (
                <Card>
                    <CardHeader><CardTitle>Ensayo de Contracción</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="contraccion1">Medición 1 [%]</Label>
                            <Input id="contraccion1" type="number" step="any" {...form.register("contraccion1", { valueAsNumber: true })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="contraccion2">Medición 2 [%]</Label>
                            <Input id="contraccion2" type="number" step="any" {...form.register("contraccion2", { valueAsNumber: true })} />
                        </div>
                    </CardContent>
                </Card>
            )}

            {tipoEnsayo === 'impacto' && (
                <Card>
                    <CardHeader><CardTitle>Ensayo de Impacto</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="impactoFallas">N° de Fallas</Label>
                            <Input id="impactoFallas" type="number" {...form.register("impactoFallas", { valueAsNumber: true })} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="impactoTotal">N° Total de Muestras</Label>
                            <Input id="impactoTotal" type="number" {...form.register("impactoTotal", { valueAsNumber: true })} />
                        </div>
                    </CardContent>
                </Card>
            )}

             {tipoEnsayo === 'phi' && (
                <Card>
                    <CardHeader><CardTitle>Ensayo de Presión Hidrostática</CardTitle></CardHeader>
                    <CardContent>
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
                            <Label htmlFor="phiSinFallas" className="text-base">
                                Sin fallas a la presión y tiempo establecidos
                            </Label>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end">
                <Button type="submit">
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    Guardar Ensayo
                </Button>
            </div>
        </form>
    );
}
