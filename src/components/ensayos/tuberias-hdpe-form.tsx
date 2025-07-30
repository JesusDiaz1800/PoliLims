"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilePlus2, Trash2, PlusCircle } from "lucide-react"
import { useForm, Controller, useFieldArray } from "react-hook-form";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Option {
  value: string;
  label: string;
}

interface TuberiasHdpeFormProps {
  analistas: Option[];
}

export function TuberiasHdpeForm({ analistas }: TuberiasHdpeFormProps) {
  const { toast } = useToast();
  const { control, getValues, register } = useForm({
    defaultValues: {
      meltIndexMediciones: [{ value: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meltIndexMediciones",
  });
  
  const [meltIndexVariacion, setMeltIndexVariacion] = React.useState(0);
  const [meltIndexCalculado, setMeltIndexCalculado] = React.useState(0);
  const [densidadCalculada, setDensidadCalculada] = React.useState(0);
  const [negroHumoCalculado, setNegroHumoCalculado] = React.useState(0);

  const calculateMeltIndex = React.useCallback(() => {
    const mediciones = getValues("meltIndexMediciones");
    const valoresNumericos = mediciones
      .map(m => parseFloat(m.value))
      .filter(v => !isNaN(v) && v !== 0);

    let promedio = 0;
    if (valoresNumericos.length > 0) {
      const sum = valoresNumericos.reduce((a, b) => a + b, 0);
      promedio = sum / valoresNumericos.length;
    }
    
    const resultado = promedio * 2;
    setMeltIndexCalculado(resultado);

    const materiaPrimaMI = parseFloat(getValues("melt_index_materia_prima"));
    if (!isNaN(materiaPrimaMI) && materiaPrimaMI !== 0) {
        const variacion = Math.abs(resultado - materiaPrimaMI) / materiaPrimaMI;
        setMeltIndexVariacion(variacion * 100);
    } else {
        setMeltIndexVariacion(0);
    }
  }, [getValues]);


  const calculateDensidad = React.useCallback(() => {
    const densidadLiquido = parseFloat(getValues("densidad_liquido"));
    const masaAire = parseFloat(getValues("masa_aire"));
    const masaAgua = parseFloat(getValues("masa_agua"));

    if (!isNaN(densidadLiquido) && !isNaN(masaAire) && !isNaN(masaAgua) && (masaAire - masaAgua) !== 0) {
      const resultado = densidadLiquido * (masaAire / (masaAire - masaAgua));
      setDensidadCalculada(resultado);
    } else {
      setDensidadCalculada(0);
    }
  }, [getValues]);
  
  const calculateNegroHumo = React.useCallback(() => {
    const m1 = parseFloat(getValues("nh_m1"));
    const m2 = parseFloat(getValues("nh_m2"));
    const m3 = parseFloat(getValues("nh_m3"));
    const m4 = parseFloat(getValues("nh_m4"));

    if (!isNaN(m1) && !isNaN(m2) && !isNaN(m3) && !isNaN(m4) && (m2 - m1) !== 0) {
      const nh = ((m3 - m4) / (m2 - m1)) * 100;
      setNegroHumoCalculado(nh);
    } else {
      setNegroHumoCalculado(0);
    }
  }, [getValues]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Ensayo Registrado",
      description: "El ensayo de Tubería HDPE ha sido registrado exitosamente.",
    })
  };
  
  const ensayos = [
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "traccion", label: "Tracción y Elongación" },
    { value: "porcentaje_negro_humo", label: "% Negro de Humo" },
    { value: "dispersion_negro_humo", label: "Dispersión Negro de Humo" },
    { value: "tio", label: "TIO" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECCIÓN GENERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información General del Ensayo</CardTitle>
          <CardDescription>Datos principales de identificación y trazabilidad del producto.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
            <Controller
              name="fecha_ingreso"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="analista">Analista</Label>
            <Select>
                <SelectTrigger id="analista">
                    <SelectValue placeholder="Seleccione un analista" />
                </SelectTrigger>
                <SelectContent>
                    {analistas.map(analista => (
                      <SelectItem key={analista.value} value={analista.value}>{analista.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" placeholder="Nombre del producto"/>
          </div>

          <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Input id="lote" placeholder="Número de lote"/>
          </div>
        </CardContent>
      </Card>
      
      {/* SECCIÓN DE ENSAYOS */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados de Ensayos</CardTitle>
          <CardDescription>Seleccione el ensayo y registre los resultados obtenidos en el laboratorio.</CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="melt_index" className="w-full">
            <ScrollArea>
              <TabsList className="flex w-max">
                 {ensayos.map(ensayo => (
                    <TabsTrigger key={ensayo.value} value={ensayo.value}>{ensayo.label}</TabsTrigger>
                 ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

              {/* Pestaña Melt Index */}
              <TabsContent value="melt_index" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Melt Index (Índice de Fluidez)</CardTitle>
                    <CardDescription>
                      Fórmula Producto Terminado: PROMEDIO(mediciones) * 2
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4 p-4 border rounded-md">
                      <Label>Mediciones de extrusionado [g]</Label>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            {...register(`meltIndexMediciones.${index}.value` as const)}
                            type="number"
                            step="any"
                            placeholder={`Medición #${index + 1}`}
                            onChange={calculateMeltIndex}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                remove(index);
                                setTimeout(calculateMeltIndex, 0);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ value: '' })}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Medición
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="melt_index_materia_prima">Índice de fluidez Materia Prima [g/10min]</Label>
                        <Controller name="melt_index_materia_prima" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="Valor del lote de MP" onChange={e => { field.onChange(e); calculateMeltIndex(); }} />} />
                      </div>
                       <div className="space-y-2">
                         <Label>Índice de fluidez Producto Terminado [g/10min]</Label>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {meltIndexCalculado.toFixed(4)}
                         </div>
                       </div>
                       <div className="space-y-2">
                         <Label>Porcentaje de variación [%]</Label>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {meltIndexVariacion.toFixed(2)}%
                         </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Pestaña Densidad */}
              <TabsContent value="densidad" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Densidad</CardTitle>
                    <CardDescription>
                      Fórmula: Densidad Líquido * (Masa Aire / (Masa Aire - Masa Agua))
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="densidad_liquido">Densidad del líquido [g/cm³]</Label>
                        <Controller name="densidad_liquido" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="Ej: 0.786" onChange={e => { field.onChange(e); calculateDensidad(); }} />} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masa_aire">Masa de la muestra en aire [g]</Label>
                        <Controller name="masa_aire" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="Masa en aire" onChange={e => { field.onChange(e); calculateDensidad(); }} />} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masa_agua">Masa de la muestra en agua [g]</Label>
                        <Controller name="masa_agua" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="Masa en agua" onChange={e => { field.onChange(e); calculateDensidad(); }} />} />
                      </div>
                       <div className="space-y-2">
                         <Label>Densidad de la muestra [g/cm³]</Label>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {densidadCalculada.toFixed(4)}
                         </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Pestaña Tracción y Elongación */}
              <TabsContent value="traccion" className="mt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Ensayo: Tracción y Elongación</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="resistencia_traccion">Resistencia a la tracción promedio [Mpa]</Label>
                            <Input id="resistencia_traccion" type="number" step="any" placeholder="Resultado en MPa" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="limite_fluencia">Limite de fluencia Promedio [Mpa]</Label>
                            <Input id="limite_fluencia" type="number" step="any" placeholder="Resultado en MPa" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="elongacion_rotura">Elongación de ruptura promedio [%]</Label>
                            <Input id="elongacion_rotura" type="number" step="any" placeholder="Resultado en %" />
                        </div>
                    </CardContent>
                 </Card>
              </TabsContent>
              
              {/* Pestaña Negro de Humo */}
              <TabsContent value="porcentaje_negro_humo" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Porcentaje de Negro de Humo</CardTitle>
                    <CardDescription>
                      Fórmula: %NH = ((m3 - m4) / (m2 - m1)) * 100
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="nh_m1">m1: Cápsula vacía [g]</Label>
                        <Controller name="nh_m1" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="m1" onChange={e => { field.onChange(e); calculateNegroHumo(); }} />} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="nh_m2">m2: Cápsula con muestra [g]</Label>
                        <Controller name="nh_m2" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="m2" onChange={e => { field.onChange(e); calculateNegroHumo(); }} />} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="nh_m3">m3: Cápsula procesada (1) [g]</Label>
                        <Controller name="nh_m3" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="m3" onChange={e => { field.onChange(e); calculateNegroHumo(); }} />} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="nh_m4">m4: Cápsula procesada (2) [g]</Label>
                        <Controller name="nh_m4" control={control} render={({ field }) => <Input {...field} type="number" step="any" placeholder="m4" onChange={e => { field.onChange(e); calculateNegroHumo(); }} />} />
                      </div>
                       <div className="space-y-2">
                         <Label>% Negro de Humo</Label>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {negroHumoCalculado.toFixed(2)}%
                         </div>
                       </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña Dispersion Negro de Humo */}
              <TabsContent value="dispersion_negro_humo" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: Dispersión de Negro de Humo</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="dispersion_nh">Grado de Dispersión</Label>
                        <Input id="dispersion_nh" placeholder="Ej: Grado A1" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pestaña TIO */}
              <TabsContent value="tio" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Tiempo de Inducción a la Oxidación (TIO)</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="tio_gas">Gas utilizado</Label>
                            <Input id="tio_gas" placeholder="Ej: Nitrógeno y Oxígeno" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tio_flujo">Flujo de gas [L/min]</Label>
                            <Input id="tio_flujo" type="number" placeholder="Ej: 50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tio_temperatura">Temperatura de ensayo [°C]</Label>
                            <Input id="tio_temperatura" type="number" placeholder="Ej: 200" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tio_metodo">Método utilizado</Label>
                            <Input id="tio_metodo" placeholder="Ej: Tangente" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tio_tiempo">Tiempo de inducción a la oxidación [min]</Label>
                            <Input id="tio_tiempo" type="number" placeholder="Ej: 45" />
                        </div>
                    </CardContent>
                </Card>
              </TabsContent>
           </Tabs>
        </CardContent>
      </Card>
      
      {/* SECCIÓN DE OBSERVACIONES */}
      <Card>
        <CardHeader>
            <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Textarea id="observaciones" placeholder="Añada cualquier nota relevante sobre la muestra o los ensayos..." />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Registrar Ensayo de Tubería HDPE
        </Button>
      </div>
    </form>
  );
}
