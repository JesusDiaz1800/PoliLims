
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
import { type Ensayo } from "@/app/(app)/ensayos/seguimiento/page"
import { AlertaValidacion } from "./alerta-validacion"

interface EnsayosMecanicosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ensayo: Ensayo;
}

const formSchema = z.object({
  tipoEnsayo: z.enum(["contraccion", "impacto", "phi"]),
  contraccion1: z.number().optional(),
  contraccion2: z.number().optional(),
  impactoFallas: z.number().optional(),
  impactoTotal: z.number().optional(),
  phiSinFallas: z.boolean().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export function EnsayosMecanicosDialog({ isOpen, onClose, ensayo }: EnsayosMecanicosDialogProps) {
    const { toast } = useToast()
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tipoEnsayo: "contraccion",
            impactoTotal: 4,
            phiSinFallas: false,
        }
    });

    const { watch, register, control } = form;
    const watchedValues = watch();
    const [alertaEnsayo, setAlertaEnsayo] = React.useState<string | null>(null);

    React.useEffect(() => {
        const { tipoEnsayo, contraccion1, contraccion2, impactoFallas, phiSinFallas } = watchedValues;
        const material = ensayo.productoInfo?.material;
        let alerta = null;

        if (tipoEnsayo === 'contraccion' && contraccion1 !== undefined && contraccion2 !== undefined) {
            const promedio = (contraccion1 + contraccion2) / 2;
            if (material === "PE100" && promedio > 3) {
                alerta = "Fallo: Contracción superior al 3%";
            } else if (material === "PP-RCT/FV" && promedio > 1) {
                alerta = "Fallo: Contracción superior al 1%";
            } else if (material !== "PE100" && material !== "PP-RCT/FV" && promedio > 2) {
                alerta = "Fallo: Contracción superior al 2%";
            }
        } else if (tipoEnsayo === 'impacto' && impactoFallas !== undefined) {
             if (impactoFallas > 0) {
                alerta = "Fallo: Tubería se fisura tras ensayo";
             }
        } else if (tipoEnsayo === 'phi' && phiSinFallas === false) {
             alerta = `Fallo: Con fallas a ${ensayo.productoInfo?.presion_phi || 'N/A'} [bar]`;
        }
        
        setAlertaEnsayo(alerta);

    }, [watchedValues, ensayo.productoInfo]);


    const onSubmit = (data: FormSchemaType) => {
        console.log({ ensayoId: ensayo.id, ...data });
        toast({
            title: "Ensayos Guardados",
            description: `Los resultados para la muestra ${ensayo.id} han sido guardados.`,
        });
        if (alertaEnsayo) {
            toast({
                variant: "destructive",
                title: "Alerta de Calidad",
                description: alertaEnsayo,
            });
        }
        onClose();
        form.reset();
    }
    
    const tipoEnsayo = watch("tipoEnsayo");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px]">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Registrar Ensayos Mecánicos</DialogTitle>
                        <DialogDescription>
                           Añada los resultados para la muestra <span className="font-bold font-mono text-foreground">{ensayo.id} ({ensayo.producto})</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                         <Controller
                            control={control}
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
                                    <Input id="contraccion1" type="number" step="any" {...register("contraccion1", { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contraccion2">Medición 2 [%]</Label>
                                    <Input id="contraccion2" type="number" step="any" {...register("contraccion2", { valueAsNumber: true })} />
                                </div>
                            </div>
                        )}

                        {tipoEnsayo === 'impacto' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in">
                                <div className="space-y-2">
                                    <Label htmlFor="impactoFallas">N° de Fallas</Label>
                                    <Input id="impactoFallas" type="number" {...register("impactoFallas", { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="impactoTotal">N° Total de Muestras</Label>
                                    <Input id="impactoTotal" type="number" {...register("impactoTotal", { valueAsNumber: true })} />
                                </div>
                            </div>
                        )}

                        {tipoEnsayo === 'phi' && (
                            <div className="animate-in fade-in space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                     <div className="space-y-2">
                                        <Label>Presión de Ensayo</Label>
                                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                            {ensayo.productoInfo?.presion_phi || 'N/A'} [bar]
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Temperatura</Label>
                                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                             {ensayo.productoInfo?.temperatura_phi || 'N/A'} [°C]
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tiempo</Label>
                                        <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                             {ensayo.productoInfo?.tiempo_phi || 'N/A'} [h]
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Controller
                                        control={control}
                                        name="phiSinFallas"
                                        render={({ field }) => (
                                            <Checkbox
                                                id="phiSinFallas"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="phiSinFallas" className="font-normal leading-tight">
                                        Sin fallas a la presión y tiempo establecidos por norma
                                    </Label>
                                </div>
                            </div>
                        )}
                        <AlertaValidacion mensaje={alertaEnsayo || undefined} />
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
