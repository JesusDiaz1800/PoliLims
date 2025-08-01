
"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilePlus2, Trash2, PlusCircle, Save } from "lucide-react"
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useSearchParams, useRouter } from 'next/navigation';

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
import { useDynamicData } from "@/context/data-context";
import type { Ensayo } from "@/context/data-context";

interface Option {
  value: string;
  label: string;
}

interface TuberiasPpFormProps {
  analistas: Option[];
}

const defaultFormValues = {
  meltIndexMediciones: [{ value: '' }],
  fv_total_m1: "",
  fv_total_m2: "",
  fv_total_m3: "",
  fv_intermedia_m1: "",
  fv_intermedia_m2: "",
  fv_intermedia_m3: "",
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
};


export function TuberiasPpForm({ analistas }: TuberiasPpFormProps) {
  const { toast } = useToast();
  const { ensayos, addEnsayo, updateEnsayo, addRecentActivity } = useDynamicData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ensayoId = searchParams.get('id');

  const { control, getValues, register, watch, handleSubmit, reset } = useForm({
    defaultValues: defaultFormValues,
  });
  
  const isEditing = Boolean(ensayoId);

  React.useEffect(() => {
    if (isEditing) {
      const ensayoToEdit = ensayos.find(e => e.id === ensayoId);
      if (ensayoToEdit) {
        const formData = {
          ...defaultFormValues,
          ...ensayoToEdit,
          fecha_ingreso: ensayoToEdit.fecha ? parseISO(ensayoToEdit.fecha) : new Date(),
          meltIndexMediciones: ensayoToEdit.meltIndexMediciones || [{ value: '' }],
          id_muestra: ensayoToEdit.id,
        };
        reset(formData);
      }
    } else {
      reset(defaultFormValues);
    }
  }, [isEditing, ensayoId, ensayos, reset]);


  const { fields, append, remove } = useFieldArray({
    control,
    name: "meltIndexMediciones",
  });
  
  const [meltIndexVariacion, setMeltIndexVariacion] = React.useState(0);
  const [meltIndexCalculado, setMeltIndexCalculado] = React.useState(0);
  const [densidadCalculada, setDensidadCalculada] = React.useState(0);

  // States for Fibra de Vidrio calculations
  const [fvTotalMasaMuestra, setFvTotalMasaMuestra] = React.useState(0);
  const [fvTotalMasaCeniza, setFvTotalMasaCeniza] = React.useState(0);
  const [fvTotalPorcentaje, setFvTotalPorcentaje] = React.useState(0);
  const [fvIntermediaMasaMuestra, setFvIntermediaMasaMuestra] = React.useState(0);
  const [fvIntermediaMasaCeniza, setFvIntermediaMasaCeniza] = React.useState(0);
  const [fvIntermediaPorcentaje, setFvIntermediaPorcentaje] = React.useState(0);


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
  
  const calculateFV = React.useCallback(() => {
    // Total
    const fv_total_m1 = parseFloat(getValues("fv_total_m1"));
    const fv_total_m2 = parseFloat(getValues("fv_total_m2"));
    const fv_total_m3 = parseFloat(getValues("fv_total_m3"));

    if (!isNaN(fv_total_m1) && !isNaN(fv_total_m2) && !isNaN(fv_total_m3)) {
      const masaMuestra = fv_total_m2 - fv_total_m1;
      const masaCeniza = fv_total_m3 - fv_total_m1;
      setFvTotalMasaMuestra(masaMuestra);
      setFvTotalMasaCeniza(masaCeniza);
      if (masaMuestra !== 0) {
        setFvTotalPorcentaje((masaCeniza / masaMuestra) * 100);
      } else {
        setFvTotalPorcentaje(0);
      }
    } else {
      setFvTotalMasaMuestra(0);
      setFvTotalMasaCeniza(0);
      setFvTotalPorcentaje(0);
    }

    // Intermedia
    const fv_intermedia_m1 = parseFloat(getValues("fv_intermedia_m1"));
    const fv_intermedia_m2 = parseFloat(getValues("fv_intermedia_m2"));
    const fv_intermedia_m3 = parseFloat(getValues("fv_intermedia_m3"));
    
    if (!isNaN(fv_intermedia_m1) && !isNaN(fv_intermedia_m2) && !isNaN(fv_intermedia_m3)) {
      const masaMuestra = fv_intermedia_m2 - fv_intermedia_m1;
      const masaCeniza = fv_intermedia_m3 - fv_intermedia_m1;
      setFvIntermediaMasaMuestra(masaMuestra);
      setFvIntermediaMasaCeniza(masaCeniza);
      if (masaMuestra !== 0) {
        setFvIntermediaPorcentaje((masaCeniza / masaMuestra) * 100);
      } else {
        setFvIntermediaPorcentaje(0);
      }
    } else {
      setFvIntermediaMasaMuestra(0);
      setFvIntermediaMasaCeniza(0);
      setFvIntermediaPorcentaje(0);
    }
  }, [getValues]);
  
  // Watch for changes in FV fields and recalculate
  const watchedFvFields = watch([
    "fv_total_m1", "fv_total_m2", "fv_total_m3",
    "fv_intermedia_m1", "fv_intermedia_m2", "fv_intermedia_m3"
  ]);

  React.useEffect(() => {
    calculateFV();
  }, [watchedFvFields, calculateFV]);
  
  const onSubmit = async (data: any) => {
     const ensayoData: Omit<Ensayo, 'id' | 'tipo' | 'estado'> & { id?: string } = {
        ...data,
        fecha: format(data.fecha_ingreso, 'yyyy-MM-dd'),
        meltIndexCalculado,
        meltIndexVariacion,
        densidadCalculada,
        fvTotalPorcentaje,
        fvIntermediaPorcentaje,
    };

    if (isEditing && ensayoId) {
        const fullEnsayoData = { ...ensayoData, id: ensayoId, tipo: 'Tubería PP', estado: 'Pendiente de Revisión' };
        await updateEnsayo(fullEnsayoData);
        await addRecentActivity({ user: data.analista, action: `actualizó el ensayo de tubería PP para ${data.producto}`});
        toast({
            title: "Ensayo Actualizado",
            description: `El ensayo ${ensayoId} ha sido actualizado correctamente.`,
        });
    } else {
        const newEnsayo: Omit<Ensayo, 'id'> = {
            ...ensayoData,
            tipo: 'Tubería PP',
            estado: 'Pendiente de Revisión',
        };
        await addEnsayo(newEnsayo);
        await addRecentActivity({ user: data.analista, action: `registró un nuevo ensayo de tubería PP para ${data.producto}`});
        toast({
          title: "Ensayo Registrado",
          description: `El nuevo ensayo de tubería PP ha sido añadido a seguimiento.`,
        })
    }

    reset(defaultFormValues);
    router.push('/ensayos/seguimiento');
  };
  
  const ensayoTabs = [
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "fibra_vidrio", label: "Fibra de Vidrio" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
             <Controller
              name="analista"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="analista">
                        <SelectValue placeholder="Seleccione un analista" />
                    </SelectTrigger>
                    <SelectContent>
                        {analistas.map(analista => (
                          <SelectItem key={analista.value} value={analista.label}>{analista.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              )}
            />
          </div>
          
           <div className="space-y-2">
              <Label htmlFor="id_muestra">ID Muestra</Label>
              <Input id="id_muestra" placeholder="ID del ensayo" {...register("id_muestra")} readOnly className="bg-muted" />
          </div>

          <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" placeholder="Nombre del producto" {...register("producto")}/>
          </div>

          <div className="space-y-2">
              <Label htmlFor="lote">Lote</Label>
              <Input id="lote" placeholder="Número de lote" {...register("lote")}/>
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
                        <Input id="melt_index_materia_prima" type="number" step="any" placeholder="Valor del lote de MP" {...register("melt_index_materia_prima")} onChange={calculateMeltIndex} />
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
                        <Input id="densidad_liquido" type="number" step="any" placeholder="Ej: 0.786" {...register("densidad_liquido")} onChange={calculateDensidad} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masa_aire">Masa de la muestra en aire [g]</Label>
                        <Input id="masa_aire" type="number" step="any" placeholder="Masa en aire" {...register("masa_aire")} onChange={calculateDensidad} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="masa_agua">Masa de la muestra en agua [g]</Label>
                        <Input id="masa_agua" type="number" step="any" placeholder="Masa en agua" {...register("masa_agua")} onChange={calculateDensidad} />
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
              
              {/* Pestaña Fibra de Vidrio */}
              <TabsContent value="fibra_vidrio" className="mt-4">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fibra de vidrio Total</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="fv_total_m1">M1: Masa de Crisol [g]</Label>
                                <Input id="fv_total_m1" type="number" step="any" placeholder="Masa del crisol" {...register("fv_total_m1")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fv_total_m2">M2: Masa de Crisol + Muestra [g]</Label>
                                <Input id="fv_total_m2" type="number" step="any" placeholder="Crisol + muestra" {...register("fv_total_m2")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fv_total_m3">M3: Masa de Crisol + Ceniza [g]</Label>
                                <Input id="fv_total_m3" type="number" step="any" placeholder="Crisol + cenizas" {...register("fv_total_m3")} />
                            </div>
                            <div className="space-y-2">
                                <Label>Masa Muestra [g]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvTotalMasaMuestra.toFixed(4)}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Masa Ceniza [g]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvTotalMasaCeniza.toFixed(4)}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Porcentaje FV Total [%]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvTotalPorcentaje.toFixed(2)}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Fibra de vidrio Capa Intermedia</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="fv_intermedia_m1">M1: Masa de Crisol [g]</Label>
                                <Input id="fv_intermedia_m1" type="number" step="any" placeholder="Masa del crisol" {...register("fv_intermedia_m1")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fv_intermedia_m2">M2: Masa de Crisol + Muestra [g]</Label>
                                <Input id="fv_intermedia_m2" type="number" step="any" placeholder="Crisol + muestra" {...register("fv_intermedia_m2")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fv_intermedia_m3">M3: Masa de Crisol + Ceniza [g]</Label>
                                <Input id="fv_intermedia_m3" type="number" step="any" placeholder="Crisol + cenizas" {...register("fv_intermedia_m3")} />
                            </div>
                             <div className="space-y-2">
                                <Label>Masa Muestra [g]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvIntermediaMasaMuestra.toFixed(4)}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Masa Ceniza [g]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvIntermediaMasaCeniza.toFixed(4)}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Porcentaje FV Capa Intermedia [%]</Label>
                                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                                    {fvIntermediaPorcentaje.toFixed(2)}%
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
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
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <FilePlus2 className="mr-2 h-4 w-4" />}
          {isEditing ? 'Guardar Cambios' : 'Registrar Ensayo de Tubería PP'}
        </Button>
      </div>
    </form>
  );
}
