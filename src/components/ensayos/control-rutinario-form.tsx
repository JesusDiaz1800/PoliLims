
"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilePlus2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { TipoProducto } from "@/lib/matriz-datos"
import { AlertaValidacion } from "@/components/ensayos/alerta-validacion"
import { Separator } from "@/components/ui/separator"
import { useDynamicData } from "@/context/data-context"
import { useRouter } from "next/navigation"
import { Combobox } from "../ui/combobox"
import type { SapProduct } from "@/services/sap-service"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

interface ControlRutinarioFormProps {
  inspectores: { value: string; label: string }[]
  maquinistas: { value: string; label: string }[]
  maquinas: { value: string; label: string }[]
  productos: SapProduct[]
  marcas: { value: string; label: string }[]
  matrizProductos: TipoProducto[];
  onFormSubmit: () => void;
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
});

type FormValues = z.infer<typeof formSchema>;

type ValidationAlerts = {
  diametro?: string
  espesor_min?: string
  espesor_max?: string
  ovalidad?: string
  peso_kg_m?: string
}

const defaultFormValues: FormValues = {
  fecha_ingreso: new Date(),
  hora: format(new Date(), 'HH:mm'),
  inspector: '',
  maquinista: '',
  maquina: '',
  producto: '',
  marca: '',
  entregado_laboratorio: false,
  diametro: undefined,
  espesor_min: undefined,
  espesor_max: undefined,
  largo: undefined,
  peso_muestra: undefined,
  peso_kg_m: undefined,
  ovalidad: undefined,
  observaciones_visuales: '',
  color_tuberia: '',
  color_linea: '',
};


export function ControlRutinarioForm({ inspectores, maquinistas, maquinas, productos, marcas, matrizProductos, onFormSubmit }: ControlRutinarioFormProps) {
  const { toast } = useToast()
  const { addRegistro, addEnsayo, addRecentActivity } = useDynamicData();
  const [alerts, setAlerts] = React.useState<ValidationAlerts>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  })

  const { watch, setValue, reset, control } = form

  React.useEffect(() => {
    reset(defaultFormValues);
  }, [reset]);

  const watchedProducto = watch("producto");
  const watchedDiametro = watch("diametro");
  const watchedEspesorMin = watch("espesor_min");
  const watchedEspesorMax = watch("espesor_max");
  const watchedOvalidad = watch("ovalidad");
  const watchedPesoKgm = watch("peso_kg_m");
  const watchedPesoMuestra = watch("peso_muestra");
  const watchedLargo = watch("largo");

  React.useEffect(() => {
    if (matrizProductos.length === 0) return;
    
    const productoSeleccionadoSap = productos.find(p => p.value === watchedProducto);
    if (!productoSeleccionadoSap) {
      setAlerts({});
      return;
    }

    const productoParaValidacion = matrizProductos.find(p => p.producto === productoSeleccionadoSap.label);

    if (productoParaValidacion) {
        setValue("color_tuberia", productoParaValidacion.color_tuberia || "");
        setValue("color_linea", productoParaValidacion.color_linea || "");
        
        const newAlerts: ValidationAlerts = {}
        if (watchedDiametro !== undefined) {
            if (watchedDiametro > productoParaValidacion.diametro_max!) newAlerts.diametro = "Diámetro sobre el máximo"
            else if (watchedDiametro < productoParaValidacion.diametro_min!) newAlerts.diametro = "Diámetro bajo el mínimo"
        }
        if (watchedEspesorMin !== undefined) {
            if (watchedEspesorMin < productoParaValidacion.espesor_min_norma!) newAlerts.espesor_min = "Espesor mínimo bajo norma"
            else if (watchedEspesorMin > productoParaValidacion.espesor_max_norma!) newAlerts.espesor_min = "Espesor mínimo sobre el máximo normado"
        }
        if (watchedEspesorMax !== undefined) {
            if (watchedEspesorMax > productoParaValidacion.espesor_max_norma!) newAlerts.espesor_max = "Espesor máximo sobre norma"
            else if (watchedEspesorMax < productoParaValidacion.espesor_min_norma!) newAlerts.espesor_max = "Espesor máximo bajo el mínimo normado"
        }
        if (watchedOvalidad !== undefined && productoParaValidacion.ovalidad_norma !== null) {
            if (watchedOvalidad > productoParaValidacion.ovalidad_norma) newAlerts.ovalidad = "Ovalidad sobre norma"
        }
        if (watchedPesoKgm !== undefined && productoParaValidacion.peso_min_teorico !== null && productoParaValidacion.peso_max_teorico !== null) {
            if (watchedPesoKgm < productoParaValidacion.peso_min_teorico) newAlerts.peso_kg_m = "Peso bajo el mínimo teórico"
            else if (watchedPesoKgm > productoParaValidacion.peso_max_teorico) newAlerts.peso_kg_m = "Peso sobre el máximo teórico"
        }
        setAlerts(newAlerts)
    } else {
        setAlerts({})
    }
  }, [watchedProducto, watchedDiametro, watchedEspesorMin, watchedEspesorMax, watchedOvalidad, watchedPesoKgm, setValue, productos, matrizProductos])
  

  React.useEffect(() => {
    if (watchedPesoMuestra !== undefined && watchedLargo !== undefined && watchedLargo > 0) {
        const pesoCalculado = (watchedPesoMuestra / watchedLargo) / 10;
        setValue("peso_kg_m", parseFloat(pesoCalculado.toFixed(6)));
    }
  }, [watchedLargo, watchedPesoMuestra, setValue]);


  const onSubmit = async (data: FormValues) => {
    const resultado = Object.values(alerts).length === 0 ? "Conforme" : "No Conforme";
    const selectedProduct = productos.find(p => p.value === data.producto);
    
    if (!selectedProduct) {
        toast({
            variant: "destructive",
            title: "Error de Validación",
            description: "Debe seleccionar un producto válido de la lista.",
        });
        return;
    }

    const newRegistro = {
        fecha: format(data.fecha_ingreso, "yyyy-MM-dd"),
        hora: data.hora,
        inspector: data.inspector,
        maquinista: data.maquinista,
        maquina: data.maquina,
        producto: selectedProduct.label,
        resultado,
        enviado_lab: data.entregado_laboratorio,
    };

    try {
        const registroId = await addRegistro(newRegistro);
        await addRecentActivity({ user: data.inspector, action: `registró un nuevo control para ${selectedProduct.label}`});
        toast({
          title: "Registro Guardado",
          description: `El control para ${selectedProduct.label} ha sido registrado como ${resultado}.`,
        });

        if (data.entregado_laboratorio) {
            const productoInfo = matrizProductos.find(p => p.producto === selectedProduct.label);
            
            let tipoEnsayo = 'Tubería';
            if (productoInfo?.material === 'PE100') {
                tipoEnsayo = 'Tubería HDPE';
            } else if (productoInfo?.material?.startsWith('PP')) {
                tipoEnsayo = 'Tubería PP';
            }

            const newEnsayo = {
                id_muestra: registroId,
                tipo: tipoEnsayo,
                analista: 'Jesus Diaz',
                fecha: format(data.fecha_ingreso, "yyyy-MM-dd"),
                estado: 'Pendiente de Revisión' as const,
                producto: selectedProduct.label,
                lote: `Lote-${format(data.fecha_ingreso, 'yyMMdd')}-${data.maquina}`,
                observaciones: data.observaciones_visuales,
                maquinista: data.maquinista,
                maquina: data.maquina,
                inspector: data.inspector,
            };
            await addEnsayo(newEnsayo);
            await addRecentActivity({ user: data.inspector, action: `envió una muestra de ${selectedProduct.label} a laboratorio.`});
            toast({
                title: "Muestra Enviada a Laboratorio",
                description: `La muestra para '${tipoEnsayo}' está ahora en Seguimiento.`,
                variant: "default",
            });
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
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-4">
                    <Label className="text-base font-medium">Información de Producción</Label>
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
                                                {field.value ? format(field.value, "PPP") : <span>Seleccione una fecha</span>}
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
                                        <SelectContent>{inspectores.map(i => <SelectItem key={i.value} value={i.label}>{i.label}</SelectItem>)}</SelectContent>
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
                                        <SelectContent>{maquinistas.map(m => <SelectItem key={m.value} value={m.label}>{m.label}</SelectItem>)}</SelectContent>
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
                                    <FormLabel>Producto (SAP)</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={productos}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Buscar producto..."
                                            notFoundText="No se encontró el producto."
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
                                        <SelectContent>{marcas.map(m => <SelectItem key={m.value} value={m.label}>{m.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                    <Label className="text-base font-medium">Mediciones Dimensionales y Visuales</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField
                            control={control}
                            name="diametro"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Diámetro Ext. [mm]</FormLabel>
                                <FormControl>
                                    <Input type="number" step="any" placeholder="Ingrese el diámetro" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Valor mínimo" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Valor máximo" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Medida de ovalidad" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Largo de la muestra" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Peso en gramos" {...field} onChange={event => field.onChange(+event.target.value)} />
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
                                    <Input type="number" step="any" placeholder="Calculado..." {...field} readOnly className="bg-muted"/>
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
                                    <Input placeholder="Autocompletado..." {...field} readOnly className="bg-muted" />
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
                                    <Input placeholder="Autocompletado..." {...field} readOnly className="bg-muted"/>
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
                                    <Textarea placeholder="Añada cualquier nota sobre la calidad visual, al tacto, color, etc." rows={3} {...field}/>
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
                            <FormLabel className="text-base font-medium">Acción Final</FormLabel>
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
            </div>
        

        <div className="flex justify-end pt-6 gap-4 border-t mt-6 sticky bottom-0 bg-background/95 pb-4 -mb-4">
            <Button type="button" variant="ghost" onClick={() => form.reset(defaultFormValues)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Limpiar
            </Button>
            <Button type="submit">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Registrar Control
            </Button>
        </div>
    </form>
    </Form>
  )
}
