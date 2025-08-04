
"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilePlus2, Trash2, PlusCircle, Save } from "lucide-react"
import { useForm, useFieldArray } from "react-hook-form";

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

interface ReprocesadoFormProps {
  analistas: Option[];
  ensayoToEdit: Ensayo | null;
  onFormSubmit: () => void;
}

const defaultFormValues = {
  meltIndexMediciones: [{ value: '' }],
  fecha_ingreso: new Date(),
  analista: "",
  id_muestra: "",
  lote: "",
  observaciones: "",
  melt_index_reportado: "",
  densidad_liquido: "",
  masa_aire: "",
  masa_agua: "",
  nh_m1: "",
  nh_m2: "",
  nh_m3: "",
  nh_m4: "",
  tio_gas: "",
  tio_flujo: "",
  tio_temperatura: "",
  tio_metodo: "",
  tio_tiempo: "",
};

export function ReprocesadoForm({ analistas, ensayoToEdit, onFormSubmit }: ReprocesadoFormProps) {
  const { toast } = useToast();
  const { addEnsayo, updateEnsayo, addRecentActivity } = useDynamicData();

  const form = useForm({
    defaultValues: defaultFormValues
  });

  const { control, getValues, register, handleSubmit, reset, watch } = form;

  const isEditing = Boolean(ensayoToEdit);
  
  const watchedFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "meltIndexMediciones",
  });
  
  const [meltIndexVariacion, setMeltIndexVariacion] = React.useState(0);
  const [meltIndexCalculado, setMeltIndexCalculado] = React.useState(0);
  const [densidadCalculada, setDensidadCalculada] = React.useState(0);
  const [negroHumoCalculado, setNegroHumoCalculado] = React.useState(0);
  const [cenizasCalculado, setCenizasCalculado] = React.useState(0);
  const [cenizasCorregido, setCenizasCorregido] = React.useState(0);

  React.useEffect(() => {
    if (isEditing && ensayoToEdit) {
      const formData = {
        ...defaultFormValues,
        ...ensayoToEdit,
        fecha_ingreso: ensayoToEdit.fecha ? parseISO(ensayoToEdit.fecha) : new Date(),
        meltIndexMediciones: ensayoToEdit.meltIndexMediciones && ensayoToEdit.meltIndexMediciones.length > 0 ? ensayoToEdit.meltIndexMediciones.map((v: any) => ({ value: v || '' })) : [{ value: '' }],
        id_muestra: ensayoToEdit.id,
      };
      reset(formData);
    } else {
      reset(defaultFormValues);
    }
  }, [ensayoToEdit, isEditing, reset]);


  const calculateResults = React.useCallback(() => {
    const values = getValues();
    // Melt Index
    const mediciones = values.meltIndexMediciones;
    const valoresNumericos = mediciones
      .map(m => parseFloat(m.value))
      .filter(v => !isNaN(v) && v > 0);

    let promedio = 0;
    if (valoresNumericos.length > 0) {
      const sum = valoresNumericos.reduce((a, b) => a + b, 0);
      promedio = sum / valoresNumericos.length;
    }
    const miCalculado = promedio > 0 ? promedio * 2 : 0;
    setMeltIndexCalculado(miCalculado);
    
    const reportado = parseFloat(values.melt_index_reportado);
    if (!isNaN(reportado) && reportado > 0 && miCalculado > 0) {
      const variacion = ((miCalculado - reportado) / reportado) * 100;
      setMeltIndexVariacion(variacion);
    } else {
      setMeltIndexVariacion(0);
    }

    // Densidad
    const densidadLiquido = parseFloat(values.densidad_liquido);
    const masaAire = parseFloat(values.masa_aire);
    const masaAgua = parseFloat(values.masa_agua);
    if (!isNaN(densidadLiquido) && !isNaN(masaAire) && !isNaN(masaAgua) && (masaAire - masaAgua) !== 0) {
      const resultado = densidadLiquido * (masaAire / (masaAire - masaAgua));
      setDensidadCalculada(resultado);
    } else {
      setDensidadCalculada(0);
    }

    // Negro de Humo y Cenizas
    const m1 = parseFloat(values.nh_m1);
    const m2 = parseFloat(values.nh_m2);
    const m3 = parseFloat(values.nh_m3);
    const m4 = parseFloat(values.nh_m4);
    if (!isNaN(m1) && !isNaN(m2) && !isNaN(m3) && (m2 - m1) !== 0) {
      if (!isNaN(m4)) {
        const nh = ((m3 - m4) / (m2 - m1)) * 100;
        setNegroHumoCalculado(nh);
      } else {
        setNegroHumoCalculado(0);
      }
      const cenizas = ((m3 - m1) / (m2 - m1)) * 100;
      setCenizasCalculado(cenizas);
      setCenizasCorregido(cenizas - 0.86);
    } else {
      setNegroHumoCalculado(0);
      setCenizasCalculado(0);
      setCenizasCorregido(0);
    }
  }, [getValues]);
  
  React.useEffect(() => {
    calculateResults();
  }, [watchedFields, calculateResults]);


  const onSubmit = async (data: any) => {
    const ensayoData = {
        ...data,
        meltIndexMediciones: data.meltIndexMediciones.map((m: {value: string}) => m.value).filter((v: string) => v !== ''),
        fecha: format(data.fecha_ingreso, 'yyyy-MM-dd'),
        meltIndexCalculado,
        meltIndexVariacion,
        densidadCalculada,
        negroHumoCalculado,
        cenizasCalculado,
        cenizasCorregido,
        producto: `Reprocesado Lote ${data.lote}`,
    };

    try {
        if (isEditing && ensayoToEdit?.id) {
            const fullEnsayoData = { ...ensayoToEdit, ...ensayoData, id: ensayoToEdit.id, tipo: 'Reprocesado' };
            await updateEnsayo(ensayoToEdit.id, fullEnsayoData as Partial<Ensayo>);
            await addRecentActivity({ user: data.analista, action: `actualizó el ensayo de reprocesado para ${ensayoToEdit.id}`});
            toast({
                title: "Ensayo Actualizado",
                description: `El ensayo ${ensayoToEdit.id} ha sido actualizado correctamente.`,
            });
        } else {
            const newEnsayo: Omit<Ensayo, 'id'> = {
                ...(ensayoData as any),
                tipo: 'Reprocesado',
                estado: 'Pendiente de Revisión',
            };
            await addEnsayo(newEnsayo);
            await addRecentActivity({ user: data.analista, action: `registró un nuevo ensayo de reprocesado para el lote ${data.lote}`});
            toast({
                title: "Ensayo Registrado",
                description: `El nuevo ensayo de reprocesado ha sido añadido a seguimiento.`,
            });
        }

        onFormSubmit();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error al Guardar",
            description: "No se pudo guardar el ensayo. Por favor, intente de nuevo.",
        });
        console.error("Failed to save ensayo:", error);
    }
  };
  
  const ensayoTabs = [
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "porcentaje_negro_humo", label: "Porcentaje de Negro de Humo" },
    { value: "cenizas", label: "Porcentaje de Cenizas" },
    { value: "tio", label: "Tiempo de Inducción a la Oxidación (TIO)" },
  ];

  return (
    <Form form={form} onSubmit={handleSubmit(onSubmit)}>
      {/* SECCIÓN GENERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información General de la Muestra</CardTitle>
          <CardDescription>Datos principales de identificación y trazabilidad del material.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <FormField
              control={control}
              name="fecha_ingreso"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
              <Input id="id_muestra" placeholder="Ej: REPRO-034" {...register("id_muestra")} readOnly={isEditing} />
          </div>

          <div className="space-y-2">
              <FormLabel htmlFor="lote">Lote</FormLabel>
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
                      Fórmula: PROMEDIO(mediciones) * 2
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
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
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
                        <FormLabel htmlFor="melt_index_reportado">Índice de fluidez reportado [g/10min]</FormLabel>
                        <Input id="melt_index_reportado" type="number" placeholder="Valor de referencia" {...register("melt_index_reportado")} />
                      </div>
                       <div className="space-y-2">
                         <FormLabel>Índice de fluidez ensayado [g/10min]</FormLabel>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {meltIndexCalculado.toFixed(4)}
                         </div>
                       </div>
                       <div className="space-y-2">
                         <FormLabel>Variación</FormLabel>
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
                        <Input id="densidad_liquido" type="number" step="any" placeholder="Ej: 0.786" {...register("densidad_liquido")} />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="masa_aire">Masa de la muestra en aire [g]</FormLabel>
                        <Input id="masa_aire" type="number" step="any" placeholder="Masa en aire" {...register("masa_aire")} />
                      </div>
                      <div className="space-y-2">
                        <FormLabel htmlFor="masa_agua">Masa de la muestra en agua [g]</FormLabel>
                        <Input id="masa_agua" type="number" step="any" placeholder="Masa en agua" {...register("masa_agua")} />
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

              {/* Pestaña Negro de Humo */}
              <TabsContent value="porcentaje_negro_humo" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Porcentaje de Negro de Humo</CardTitle>
                    <CardDescription>
                      Fórmula: %NH = ((m3 - m4) / (m2 - m1)) * 100
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <FormLabel htmlFor="nh_m1">m1: Cápsula vacía [g]</FormLabel>
                        <Input id="nh_m1" type="number" step="any" placeholder="m1" {...register("nh_m1")} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m2">m2: Cápsula con muestra [g]</FormLabel>
                        <Input id="nh_m2" type="number" step="any" placeholder="m2" {...register("nh_m2")} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m3">m3: Cápsula procesada (1) [g]</FormLabel>
                        <Input id="nh_m3" type="number" step="any" placeholder="m3" {...register("nh_m3")} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m4">m4: Cápsula procesada (2) [g]</FormLabel>
                        <Input id="nh_m4" type="number" step="any" placeholder="m4" {...register("nh_m4")} />
                      </div>
                       <div className="space-y-2 md:col-start-1">
                         <FormLabel>% Negro de Humo</FormLabel>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {negroHumoCalculado.toFixed(2)}%
                         </div>
                       </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="cenizas" className="mt-4">
                 <Card>
                  <CardHeader>
                    <CardTitle>Ensayo: Porcentaje de Cenizas</CardTitle>
                    <CardDescription>
                      Fórmula: %Cenizas = ((m3 - m1) / (m2 - m1)) * 100
                    </CardDescription>
                  </CardHeader>
                   <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div className="space-y-2">
                        <FormLabel htmlFor="nh_m1">m1: Cápsula vacía [g]</FormLabel>
                        <Input id="nh_m1" type="number" step="any" placeholder="m1" {...register("nh_m1")} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m2">m2: Cápsula con muestra [g]</FormLabel>
                        <Input id="nh_m2" type="number" step="any" placeholder="m2" {...register("nh_m2")} />
                      </div>
                       <div className="space-y-2">
                        <FormLabel htmlFor="nh_m3">m3: Cápsula procesada [g]</FormLabel>
                        <Input id="nh_m3" type="number" step="any" placeholder="m3" {...register("nh_m3")} />
                      </div>
                       <div className="space-y-2 md:col-start-1">
                         <FormLabel>% Cenizas</FormLabel>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {cenizasCalculado.toFixed(2)}%
                         </div>
                       </div>
                       <div className="space-y-2">
                         <FormLabel>% Cenizas Corregido</FormLabel>
                         <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm">
                            {cenizasCorregido.toFixed(2)}%
                         </div>
                       </div>
                  </CardContent>
                </Card>
              </TabsContent>
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
                            <Input id="tio_flujo" type="number" placeholder="Ej: 50" {...register("tio_flujo")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_temperatura">Temperatura de ensayo [°C]</FormLabel>
                            <Input id="tio_temperatura" type="number" placeholder="Ej: 200" {...register("tio_temperatura")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_metodo">Método utilizado</FormLabel>
                            <Input id="tio_metodo" placeholder="Ej: Tangente" {...register("tio_metodo")} />
                        </div>
                        <div className="space-y-2">
                            <FormLabel htmlFor="tio_tiempo">Tiempo de inducción a la oxidación [min]</FormLabel>
                            <Input id="tio_tiempo" type="number" placeholder="Ej: 45" {...register("tio_tiempo")} />
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

      <div className="flex justify-end pt-4 sticky bottom-0 bg-card/95 pb-4 -mb-4 -mx-6 px-6">
        <Button type="submit">
          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <FilePlus2 className="mr-2 h-4 w-4" />}
          {isEditing ? 'Guardar Cambios' : 'Registrar Ensayo'}
        </Button>
      </div>
    </Form>
  );
}
