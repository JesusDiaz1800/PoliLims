
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilePlus2, RefreshCw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { AlertaValidacion } from "@/components/ensayos/alerta-validacion"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import * as dataService from "@/services/data-service"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip"
import type { TipoProducto } from "@/lib/matriz-datos"
import { Combobox } from "../ui/combobox"

interface ControlRutinarioFormProps {
  inspectores: { value: string; label: string }[]
  maquinistas: { value: string; label: string }[]
  maquinas: { value: string; label: string }[]
  marcas: { value: string; label: string }[]
  onFormSubmit: () => void;
  productos: { label: string; value: string }[];
  matrizProductos: TipoProducto[];
}

const formSchema = z.object({
  fecha_ingreso: z.date({ 
    required_error: "La fecha es requerida.",
    invalid_type_error: "Formato de fecha inválido." 
  }),
  hora: z.string().nonempty("La hora es requerida."),
  inspector: z.string().nonempty("El inspector es requerido."),
  maquinista: z.string().nonempty("El maquinista es requerido."),
  maquina: z.string().nonempty("La máquina es requerida."),
  producto: z.string().nonempty("El producto es requerido."),
  marca: z.string().nonempty("La marca es requerida."),
  diametro: z.number().optional(),
  espesor_min: z.number().optional(),
  espesor_max: z.number().optional(),
  largo: z.number().optional(),
  peso_muestra: z.number().optional(),
  peso_kg_m: z.number().optional(),
  ovalidad: z.number().optional(),
  observaciones_visuales: z.string().optional(),
  color_tuberia: z.string().optional(),
  color_linea: z.string().optional(),
  entregado_laboratorio: z.boolean().default(false),
}).passthrough();


type FormValues = z.infer<typeof formSchema>;

type ValidationAlerts = {
  diametro?: string
  espesor_min?: string
  espesor_max?: string
  ovalidad?: string
  peso_kg_m?: string
}

const defaultFormValues: Partial<FormValues> = {
  fecha_ingreso: new Date(),
  hora: format(new Date(), 'HH:mm'),
  inspector: '',
  maquinista: '',
  maquina: '',
  producto: '',
  marca: '',
  entregado_laboratorio: false,
};


export function ControlRutinarioForm({ inspectores, maquinistas, maquinas, marcas, onFormSubmit, productos, matrizProductos }: ControlRutinarioFormProps) {
  const { toast } = useToast()
  const [alerts, setAlerts] = React.useState<ValidationAlerts>({})
  const hasAlerts = Object.values(alerts).some(Boolean);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const { watch, setValue, control } = form

  const watchedPesoMuestra = watch("peso_muestra");
  const watchedLargo = watch("largo");
  
  
  React.useEffect(() => {
    if (watchedPesoMuestra !== undefined && watchedLargo !== undefined && watchedLargo > 0) {
        const pesoCalculado = (watchedPesoMuestra / watchedLargo) / 10;
        setValue("peso_kg_m", parseFloat(pesoCalculado.toFixed(6)));
    }
  }, [watchedLargo, watchedPesoMuestra, setValue]);


  const onSubmit = async (data: FormValues) => {
    const resultado = Object.values(alerts).some(Boolean) ? "No Conforme" : "Conforme";
    
    const newRegistroData = {
        fecha: format(data.fecha_ingreso, "dd-MM-yyyy"),
        hora: data.hora,
        inspector: data.inspector,
        maquinista: data.maquinista,
        maquina: data.maquina,
        producto: data.producto,
        marca: data.marca,
        diametro: data.diametro,
        espesor_min: data.espesor_min,
        espesor_max: data.espesor_max,
        largo: data.largo,
        peso_muestra: data.peso_muestra,
        peso_kg_m: data.peso_kg_m,
        ovalidad: data.ovalidad,
        observaciones_visuales: data.observaciones_visuales,
        color_tuberia: data.color_tuberia,
        color_linea: data.color_linea,
        resultado,
        enviado_lab: data.entregado_laboratorio,
    };

    try {
        const newRegistro = await dataService.addRegistro(newRegistroData);
        
        toast({
          title: "Registro Guardado",
          description: `El control para ${data.producto} ha sido registrado como ${resultado}.`,
          variant: resultado === 'No Conforme' ? 'destructive' : 'default',
        });

        await dataService.addRecentActivity({ user: data.inspector, action: `registró un nuevo control para ${data.producto}`});
        
        if (data.entregado_laboratorio) {
            let tipoEnsayo = 'Tubería';

            const newEnsayo = {
                id_muestra: newRegistro.id,
                tipo: tipoEnsayo,
                analista: '', // Default analyst, lab will assign it
                fecha: format(new Date(), "dd-MM-yyyy"), // Fecha del Ensayo es hoy
                estado: 'Pendiente de Revisión' as const,
                producto: data.producto,
                lote: `Lote-${format(data.fecha_ingreso, 'yyMMdd')}-${data.maquina}`,
                observaciones: data.observaciones_visuales || '',
                // Trazabilidad
                fecha_ingreso: format(data.fecha_ingreso, "dd-MM-yyyy"),
                hora: data.hora,
                maquinista: data.maquinista,
                maquina: data.maquina,
                inspector: data.inspector,
            };
            await dataService.addEnsayo(newEnsayo);
            
            toast({
                title: "Muestra Enviada a Laboratorio",
                description: `La muestra para '${tipoEnsayo}' está ahora en Seguimiento.`,
                variant: "default",
            });
            await dataService.addRecentActivity({ user: data.inspector, action: `envió una muestra de ${data.producto} a laboratorio.`});
        }
        
        form.reset(defaultFormValues);
        onFormSubmit();

    } catch (error) {
        console.error("Error submitting form: ", error);
        toast({
            variant: "destructive",
            title: "Error al Guardar",
            description: "No se pudo guardar el registro. Por favor, revise la consola para más detalles.",
        });
    }
  }

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Información de Producción</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                    control={control}
                    name="fecha_ingreso"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "dd-MM-yyyy") : <span>Seleccione una fecha</span>}
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="hora"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <FormControl>
                            <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="inspector"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Inspector</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{inspectores.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={control}
                    name="maquinista"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maquinista</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{maquinistas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="maquina"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Máquina</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{maquinas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="producto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Producto</FormLabel>
                            <FormControl>
                                <Combobox 
                                    options={productos}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Buscar producto..."
                                    notFoundText="No se encontró producto."
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="marca"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Marca</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{marcas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <Separator />
        
        <div className="space-y-4">
            <h3 className="text-lg font-medium font-headline">Mediciones Dimensionales y Visuales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                    control={control}
                    name="diametro"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Diámetro Ext. [mm]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Ingrese el diámetro" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        <AlertaValidacion mensaje={alerts.diametro} />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="espesor_min"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Espesor Mín. [mm]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Valor mínimo" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        <AlertaValidacion mensaje={alerts.espesor_min} />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="espesor_max"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Espesor Máx. [mm]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Valor máximo" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        <AlertaValidacion mensaje={alerts.espesor_max} />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="ovalidad"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ovalidad [mm]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Medida de ovalidad" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        <AlertaValidacion mensaje={alerts.ovalidad} />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="largo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Largo Muestra [mm]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Largo de la muestra" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="peso_muestra"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Peso muestra [g]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Peso en gramos" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="peso_kg_m"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Peso [kg/m]</FormLabel>
                        <FormControl>
                            <Input type="number" step="any" placeholder="Calculado..." {...field} value={field.value ?? ''} readOnly className="bg-muted"/>
                        </FormControl>
                            <AlertaValidacion mensaje={alerts.peso_kg_m} />
                        </FormItem>
                    )}
                />
            </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <FormField
                    control={control}
                    name="color_tuberia"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Color de Tubería</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Negro, Verde" {...field} value={field.value ?? ''} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="color_linea"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Color de Línea de Identificación</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Azul, Roja" {...field} value={field.value ?? ''} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="observaciones_visuales"
                    render={({ field }) => (
                        <FormItem className="md:col-span-3">
                        <FormLabel>Observaciones de Calidad Visual</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Añada cualquier nota sobre la calidad visual, al tacto, color, etc." rows={3} {...field} value={field.value ?? ''}/>
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <Separator />
        
            <FormField
            control={control}
            name="entregado_laboratorio"
            render={({ field }) => (
                <FormItem>
                    <h3 className="text-lg font-medium font-headline">Acción Final</h3>
                    <div className="items-top flex space-x-3 p-4 rounded-lg border bg-card">
                        <FormControl>
                            <Checkbox
                                id="entregado_laboratorio"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5"
                            />
                        </FormControl>
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="entregado_laboratorio"
                                className="font-semibold cursor-pointer"
                            >
                                Muestra Entregada a Laboratorio
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Marque esta casilla si la muestra física ha sido enviada. Esto creará un nuevo registro de ensayo en el área de Seguimiento para que el laboratorio proceda con los análisis restantes (Melt Index, Densidad, etc.).
                            </p>
                        </div>
                    </div>
                </FormItem>
            )}
            />
    
        <div className="flex justify-end pt-6 gap-4 border-t mt-6 sticky bottom-0 bg-card/95 pb-4 -mb-4 -mx-6 px-6">
            <Button type="button" variant="ghost" onClick={() => form.reset(defaultFormValues)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Limpiar
            </Button>
            <Button type="submit" className={cn(hasAlerts && 'bg-destructive/90 hover:bg-destructive text-destructive-foreground')}>
                {hasAlerts && <AlertTriangle className="mr-2 h-4 w-4" />}
                <FilePlus2 className="mr-2 h-4 w-4" />
                Registrar Control
            </Button>
        </div>
    </Form>
  )
}
