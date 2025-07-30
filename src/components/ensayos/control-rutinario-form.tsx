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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { matrizProductos } from "@/lib/matriz-datos"
import { AlertaValidacion } from "@/components/ensayos/alerta-validacion"
import { Separator } from "@/components/ui/separator"

interface Option {
  value: string
  label: string
}

interface ControlRutinarioFormProps {
  inspectores: Option[]
  maquinistas: Option[]
  maquinas: Option[]
  productos: Option[]
  marcas: Option[]
}

const formSchema = z.object({
  fecha_ingreso: z.date({ required_error: "La fecha es requerida." }),
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
})

type ValidationAlerts = {
  diametro?: string
  espesor_min?: string
  espesor_max?: string
  ovalidad?: string
  peso_kg_m?: string
}

export function ControlRutinarioForm({ inspectores, maquinistas, maquinas, productos, marcas }: ControlRutinarioFormProps) {
  const { toast } = useToast()
  const [alerts, setAlerts] = React.useState<ValidationAlerts>({})

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entregado_laboratorio: false,
    },
  })

  const { watch, setValue } = form

  const producto = watch("producto")
  const diametro = watch("diametro")
  const espesor_min = watch("espesor_min")
  const espesor_max = watch("espesor_max")
  const ovalidad = watch("ovalidad")
  const peso_kg_m = watch("peso_kg_m")

  React.useEffect(() => {
    const productoSeleccionado = matrizProductos.find(p => p.producto === producto)

    if (!productoSeleccionado) {
      setAlerts({});
      return;
    }
    
    const newAlerts: ValidationAlerts = {}

    if (diametro !== undefined) {
      if (diametro > productoSeleccionado.diametro_max) newAlerts.diametro = "Diámetro sobre el máximo"
      else if (diametro < productoSeleccionado.diametro_min) newAlerts.diametro = "Diámetro bajo el mínimo"
    }
    if (espesor_min !== undefined) {
      if (espesor_min < productoSeleccionado.espesor_min_norma) newAlerts.espesor_min = "Espesor mínimo bajo norma"
    }
    if (espesor_max !== undefined) {
      if (espesor_max > productoSeleccionado.espesor_max_norma) newAlerts.espesor_max = "Espesor máximo sobre norma"
    }
    if (ovalidad !== undefined && productoSeleccionado.ovalidad_norma) {
      if (ovalidad > productoSeleccionado.ovalidad_norma) newAlerts.ovalidad = "Ovalidad sobre norma"
    }
    if (peso_kg_m !== undefined) {
        if (peso_kg_m < productoSeleccionado.peso_min_teorico) newAlerts.peso_kg_m = "Peso bajo el mínimo teórico"
        else if (peso_kg_m > productoSeleccionado.peso_max_teorico) newAlerts.peso_kg_m = "Peso sobre el máximo teórico"
    }
    setAlerts(newAlerts)
  }, [producto, diametro, espesor_min, espesor_max, ovalidad, peso_kg_m])


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    toast({
      title: "Registro Guardado",
      description: "El control rutinario ha sido registrado exitosamente.",
    })
    if (data.entregado_laboratorio) {
        toast({
            title: "Muestra Enviada a Laboratorio",
            description: `La muestra para ${data.producto} ha sido enviada para análisis y aparece en Seguimiento.`,
            variant: "default",
        })
        // TODO: Here we would trigger the logic to add the sample to the tracking table.
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Información de Producción</CardTitle>
            <CardDescription>Datos de trazabilidad de la línea de producción.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="space-y-2">
              <Label htmlFor="fecha_ingreso">Fecha</Label>
              <Controller
                control={form.control}
                name="fecha_ingreso"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Seleccione una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input id="hora" type="time" {...form.register("hora")} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="inspector">Inspector</Label>
                <Controller
                    control={form.control}
                    name="inspector"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="inspector"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>{inspectores.map(i => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="maquinista">Maquinista</Label>
                 <Controller
                    control={form.control}
                    name="maquinista"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="maquinista"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>{maquinistas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="maquina">Máquina</Label>
                 <Controller
                    control={form.control}
                    name="maquina"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="maquina"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>{maquinas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                 <Controller
                    control={form.control}
                    name="producto"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="producto"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>{productos.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                 <Controller
                    control={form.control}
                    name="marca"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="marca"><SelectValue placeholder="Seleccione..." /></SelectTrigger>
                            <SelectContent>{marcas.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                        </Select>
                    )}
                />
            </div>
        </CardContent>
      </Card>
      
        <Card>
            <CardHeader><CardTitle>Mediciones Dimensionales y Visuales</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="diametro">Diámetro Ext. [mm]</Label>
                        <Input id="diametro" type="number" step="any" placeholder="Ingrese el diámetro" {...form.register("diametro", { valueAsNumber: true })}/>
                        <AlertaValidacion mensaje={alerts.diametro} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="espesor_min">Espesor Mín. [mm]</Label>
                        <Input id="espesor_min" type="number" step="any" placeholder="Valor mínimo" {...form.register("espesor_min", { valueAsNumber: true })}/>
                        <AlertaValidacion mensaje={alerts.espesor_min} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="espesor_max">Espesor Máx. [mm]</Label>
                        <Input id="espesor_max" type="number" step="any" placeholder="Valor máximo" {...form.register("espesor_max", { valueAsNumber: true })}/>
                        <AlertaValidacion mensaje={alerts.espesor_max} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="largo">Largo Muestra [mm]</Label>
                        <Input id="largo" type="number" step="any" placeholder="Largo de la muestra" {...form.register("largo", { valueAsNumber: true })}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="peso_muestra">Peso muestra [g]</Label>
                        <Input id="peso_muestra" type="number" step="any" placeholder="Peso en gramos" {...form.register("peso_muestra", { valueAsNumber: true })}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="peso_kg_m">Peso [kg/m]</Label>
                        <Input id="peso_kg_m" type="number" step="any" placeholder="Peso en kg/metro" {...form.register("peso_kg_m", { valueAsNumber: true })}/>
                        <AlertaValidacion mensaje={alerts.peso_kg_m} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ovalidad">Ovalidad [mm]</Label>
                        <Input id="ovalidad" type="number" step="any" placeholder="Medida de ovalidad" {...form.register("ovalidad", { valueAsNumber: true })}/>
                        <AlertaValidacion mensaje={alerts.ovalidad} />
                    </div>
                </div>
                 <Separator />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="color_tuberia">Color de Tubería</Label>
                        <Input id="color_tuberia" placeholder="Ej: Negro" {...form.register("color_tuberia")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="color_linea">Color de Línea de Identificación</Label>
                        <Input id="color_linea" placeholder="Ej: Azul" {...form.register("color_linea")} />
                    </div>
                     <div className="space-y-2 md:col-span-3">
                        <Label htmlFor="observaciones_visuales">Observaciones de Calidad Visual</Label>
                        <Textarea id="observaciones_visuales" placeholder="Añada cualquier nota sobre la calidad visual, al tacto, color, etc." rows={3} {...form.register("observaciones_visuales")}/>
                    </div>
                 </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Ensayos de Laboratorio</CardTitle>
                <CardDescription>Esta sección será completada por el analista de laboratorio.</CardDescription>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground p-8">
                <p>Los ensayos (Mecánicos, HDPE, PP, etc.) se registrarán sobre esta muestra una vez que sea entregada al laboratorio.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Acción Final</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="items-top flex space-x-2">
                    <Controller
                        control={form.control}
                        name="entregado_laboratorio"
                        render={({ field }) => (
                           <Checkbox
                                id="entregado_laboratorio"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5"
                            />
                        )}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="entregado_laboratorio" className="text-base font-medium">
                            Entregado a Laboratorio
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Marque esta casilla si la muestra física ha sido enviada. Esto creará un nuevo registro de ensayo en el área de Seguimiento para que el laboratorio proceda.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

      <div className="flex justify-end pt-4 gap-4">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Limpiar Formulario
        </Button>
        <Button type="submit">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Registrar Control
        </Button>
      </div>
    </form>
  )
}
