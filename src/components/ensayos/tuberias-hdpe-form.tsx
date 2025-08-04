
"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilePlus2, Trash2, PlusCircle, Save } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from 'next/navigation';

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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useDynamicData } from "@/context/data-context";
import type { Ensayo } from "@/context/data-context";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";


interface Option {
  value: string;
  label: string;
}

interface TuberiasHdpeFormProps {
  analistas: Option[];
  ensayo: Ensayo;
  onFormSubmit: () => void;
}

const defaultFormValues = {
  meltIndexMediciones: Array(6).fill({ value: '' as string | number }),
  fecha_ingreso: new Date(),
  analista: "",
  producto: "",
  id_muestra: "",
  lote: "",
  observaciones: "",
  melt_index_materia_prima: "",
  densidad_liquido: "",
  masa_aire: "",
  masa_agua: "",
  resistencia_traccion: "",
  limite_fluencia: "",
  elongacion_rotura: "",
  nh_m1: "",
  nh_m2: "",
  nh_m3: "",
  nh_m4: "",
  dispersion_nh: "",
  tio_gas: "",
  tio_flujo: "",
  tio_temperatura: "",
  tio_metodo: "",
  tio_tiempo: "",
};

export function TuberiasHdpeForm({ analistas, ensayo, onFormSubmit }: TuberiasHdpeFormProps) {
  const { toast } = useToast();
  const { updateEnsayo, addRecentActivity } = useDynamicData();

  const form = useForm({
    defaultValues: defaultFormValues,
  });

  const { control, getValues, register, handleSubmit, reset } = form;

  React.useEffect(() => {
      if (ensayo) {
          let mediciones = ensayo.meltIndexMediciones && ensayo.meltIndexMediciones.length > 0 
            ? ensayo.meltIndexMediciones.map((v: any) => ({ value: v || '' })) 
            : [];
        
          if (mediciones.length < 6) {
              mediciones = [...mediciones, ...Array(6 - mediciones.length).fill({ value: '' })];
          }

          const formData = {
              ...defaultFormValues,
              ...ensayo,
              fecha_ingreso: ensayo.fecha ? parseISO(ensayo.fecha) : new Date(),
              meltIndexMediciones: mediciones,
              id_muestra: ensayo.id,
              analista: ensayo.analista,
          };
          reset(formData);
      }
  }, [ensayo, reset]);


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


  const onSubmit = async (data: any) => {
    const ensayoData: Partial<Ensayo> = {
        ...ensayo,
        ...data,
        meltIndexMediciones: data.meltIndexMediciones.map((m: {value: string}) => m.value).filter((v: string) => v !== ''),
        fecha: format(data.fecha_ingreso, 'yyyy-MM-dd'),
        meltIndexCalculado,
        meltIndexVariacion,
        densidadCalculada,
        negroHumoCalculado,
        estado: 'En Progreso',
    };

    await updateEnsayo(ensayo.id, ensayoData);
    await addRecentActivity({ user: data.analista, action: `ingresó resultados para el ensayo de Tubería HDPE: ${ensayo.id}`});
    toast({
        title: "Resultados Guardados",
        description: `Los resultados para el ensayo ${ensayo.id} han sido guardados.`,
    });
    
    onFormSubmit();
  };
  
  const ensayoTabs = [
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "traccion", label: "Tracción y Elongación" },
    { value: "porcentaje_negro_humo", label: "% Negro de Humo" },
    { value: "dispersion_negro_humo", label: "Dispersión Negro de Humo" },
    { value: "tio", label: "TIO" },
  ];

  return (
    <Form form={form} onSubmit={onSubmit}>
      {/* SECCIÓN GENERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información General del Ensayo</CardTitle>
          <CardDescription>Datos principales de identificación y trazabilidad del producto.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <FormField
            control={control}
            name="fecha_ingreso"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Fecha de Ingreso</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                    </Button>
                    </FormControl>
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
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="analista"
            render={({ field }) => (
              <FormItem className="space-y-2">
                 <FormLabel>Analista</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="analista">
                        <SelectValue placeholder="Seleccione un analista" />
                    </SelectTrigger>
                  </FormControl>
                    <SelectContent>
                        {analistas.map(analista => (
                          <SelectItem key={analista.value} value={analista.label}>{analista.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
           <div className="space-y-2">
              <FormLabel htmlFor="id_muestra">ID Muestra</FormLabel>
              <Input id="id_muestra" placeholder="ID del ensayo" {...register("id_muestra")} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
              <FormLabel htmlFor="producto">Producto</FormLabel>
              <Input id="producto" placeholder="Nombre del producto" {...register("producto")} readOnly className="bg-muted"/>
          </div>

          <div className="space-y-2">
              <FormLabel htmlFor="lote">Lote</FormLabel>
              <Input id="lote" placeholder="Número de lote" {...register("lote")} readOnly className="bg-muted"/>
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
                 {ensayoTabs.map(ensayo => (
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
                      <FormLabel>Mediciones de extrusionado [g]</FormLabel>
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
                        <FormLabel htmlFor="melt_index_materia_prima">Índice de fluidez Materia Prima [g/10min]</FormLabel>
                        <Input id="melt_index_materia_prima" type="number" step="any" placeholder="Valor del lote de MP" {...register("melt_index_materia_prima")} onChange={calculateMeltIndex} />
                      </div>
                       <div className="space-y-2">
                         <FormLabel>Índice de fluidez Producto Terminado [g/10min]</FormLabel>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {meltIndexCalculado.toFixed(4)}
                         </div>
                       </div>
                       <div className="space-y-2">
                         <FormLabel>Porcentaje de variación [%]</FormLabel>
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
                        <FormLabel htmlFor="densidad_liquido">Densidad del líquido [g/cm³]</FormLabel>
                        <Input id="densidad_liquido" type="number" step="any" placeholder="Ej: 0.786" {...register("densidad_liquido")} onChange={calculateDensidad} />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="masa_aire">Masa de la muestra en aire [g]</FormLabel>
                        <Input id="masa_aire" type="number" step="any" placeholder="Masa en aire" {...register("masa_aire")} onChange={calculateDensidad} />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="masa_agua">Masa de la muestra en agua [g]</FormLabel>
                        <Input id="masa_agua" type="number" step="any" placeholder="Masa en agua" {...register("masa_agua")} onChange={calculateDensidad} />
                      </div>
                       <div className="space-y-2">
                         <FormLabel>Densidad de la muestra [g/cm³]</FormLabel>
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
                            <FormLabel htmlFor="resistencia_traccion">Resistencia a la tracción promedio [Mpa]</FormLabel>
                            <Input id="resistencia_traccion" type="number" step="any" placeholder="Resultado en MPa" {...register("resistencia_traccion")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="limite_fluencia">Limite de fluencia Promedio [Mpa]</FormLabel>
                            <Input id="limite_fluencia" type="number" step="any" placeholder="Resultado en MPa" {...register("limite_fluencia")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="elongacion_rotura">Elongación de ruptura promedio [%]</FormLabel>
                            <Input id="elongacion_rotura" type="number" step="any" placeholder="Resultado en %" {...register("elongacion_rotura")} />
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
                        <FormLabel htmlFor="nh_m1">m1: Cápsula vacía [g]</FormLabel>
                        <Input id="nh_m1" type="number" step="any" placeholder="m1" {...register("nh_m1")} onChange={calculateNegroHumo} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m2">m2: Cápsula con muestra [g]</FormLabel>
                        <Input id="nh_m2" type="number" step="any" placeholder="m2" {...register("nh_m2")} onChange={calculateNegroHumo} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m3">m3: Cápsula con muestra procesada [g]</FormLabel>
                        <Input id="nh_m3" type="number" step="any" placeholder="m3" {...register("nh_m3")} onChange={calculateNegroHumo} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m4">m4: Cápsula con ceniza [g]</FormLabel>
                        <Input id="nh_m4" type="number" step="any" placeholder="m4" {...register("nh_m4")} onChange={calculateNegroHumo} />
                      </div>
                       <div className="space-y-2">
                         <FormLabel>% Negro de Humo</FormLabel>
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
                        <FormLabel htmlFor="dispersion_nh">Grado de Dispersión</FormLabel>
                        <Input id="dispersion_nh" placeholder="Ej: Grado A1" {...register("dispersion_nh")} />
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
                            <FormLabel htmlFor="tio_gas">Gas utilizado</FormLabel>
                            <Input id="tio_gas" placeholder="Ej: Nitrógeno y Oxígeno" {...register("tio_gas")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_flujo">Flujo de gas [L/min]</FormLabel>
                            <Input id="tio_flujo" type="number" step="any" placeholder="Ej: 50" {...register("tio_flujo")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_temperatura">Temperatura de ensayo [°C]</FormLabel>
                            <Input id="tio_temperatura" type="number" step="any" placeholder="Ej: 200" {...register("tio_temperatura")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_metodo">Método utilizado</FormLabel>
                            <Input id="tio_metodo" placeholder="Ej: Tangente" {...register("tio_metodo")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_tiempo">Tiempo de inducción a la oxidación [min]</FormLabel>
                            <Input id="tio_tiempo" type="number" step="any" placeholder="Ej: 45" {...register("tio_tiempo")} />
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
                <Textarea id="observaciones" placeholder="Añada cualquier nota relevante sobre la muestra o los ensayos..." {...register("observaciones")} />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Guardar Resultados
        </Button>
      </div>
    </Form>
  );
}

    