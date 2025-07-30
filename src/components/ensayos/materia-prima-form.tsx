"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, FilePlus2, Percent } from "lucide-react"
import { useForm, Controller } from "react-hook-form";

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

interface MateriaPrimaFormProps {
  analistas: Option[];
}

export function MateriaPrimaForm({ analistas }: MateriaPrimaFormProps) {
  const { toast } = useToast();
  const { watch, control, setValue, getValues } = useForm();
  
  const [meltIndexVariacion, setMeltIndexVariacion] = React.useState(0);

  const calculateMeltIndexVariation = () => {
    const reportado = parseFloat(getValues("melt_index_reportado"));
    const ensayado = parseFloat(getValues("melt_index_ensayado"));

    if (!isNaN(reportado) && !isNaN(ensayado) && reportado !== 0) {
      const variacion = Math.abs(ensayado - reportado) / reportado;
      setMeltIndexVariacion(variacion * 100);
    } else {
      setMeltIndexVariacion(0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Ensayo Registrado",
      description: "El ensayo de materia prima ha sido registrado exitosamente.",
    })
  }
  
  const ensayos = [
    { value: "melt_index", label: "Melt Index" },
    { value: "densidad", label: "Densidad" },
    { value: "porcentaje_negro_humo", label: "Porcentaje de Negro de Humo" },
    { value: "dsc", label: "DSC" },
    { value: "tio", label: "Tiempo de Inducción a la Oxidación (TIO)" },
    { value: "cenizas", label: "Porcentaje de Cenizas" },
    { value: "humedad", label: "Porcentaje de Humedad" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECCIÓN GENERAL */}
      <Card>
        <CardHeader>
          <CardTitle>Información General de la Muestra</CardTitle>
          <CardDescription>Datos principales de identificación y trazabilidad del material.</CardDescription>
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
              <Label htmlFor="tipo_material">Tipo de Material</Label>
              <Input id="tipo_material" placeholder="Ej: Polietileno de Alta Densidad"/>
          </div>

          <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input id="proveedor" placeholder="Nombre del proveedor"/>
          </div>

          <div className="space-y-2">
              <Label htmlFor="producto">Producto</Label>
              <Input id="producto" placeholder="Nombre del producto"/>
          </div>

          <div className="space-y-2">
              <Label htmlFor="orden_compra">Orden de Compra</Label>
              <Input id="orden_compra" placeholder="Número de orden de compra"/>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                      <div className="space-y-2">
                        <Label htmlFor="melt_index_reportado">Índice de fluidez reportado [g/10min]</Label>
                        <Controller name="melt_index_reportado" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Valor del proveedor" onChange={e => { field.onChange(e); calculateMeltIndexVariation(); }} />} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="melt_index_ensayado">Índice de fluidez ensayado [g/10min]</Label>
                        <Controller name="melt_index_ensayado" control={control} render={({ field }) => <Input {...field} type="number" placeholder="Valor del laboratorio" onChange={e => { field.onChange(e); calculateMeltIndexVariation(); }} />} />
                      </div>
                       <div className="space-y-2">
                         <Label>Variación</Label>
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
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                     <p className="text-muted-foreground p-8">Formulario para Densidad próximamente.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Otras Pestañas */}
              <TabsContent value="porcentaje_negro_humo" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: Porcentaje de Negro de Humo</CardTitle></CardHeader>
                  <CardContent className="text-center"><p className="text-muted-foreground p-8">Formulario próximamente.</p></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="dsc" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: DSC</CardTitle></CardHeader>
                  <CardContent className="text-center"><p className="text-muted-foreground p-8">Formulario próximamente.</p></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tio" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: Tiempo de Inducción a la Oxidación (TIO)</CardTitle></CardHeader>
                  <CardContent className="text-center"><p className="text-muted-foreground p-8">Formulario próximamente.</p></CardContent>
                </Card>
              </TabsContent>
               <TabsContent value="cenizas" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: Porcentaje de Cenizas</CardTitle></CardHeader>
                  <CardContent className="text-center"><p className="text-muted-foreground p-8">Formulario próximamente.</p></CardContent>
                </Card>
              </TabsContent>
               <TabsContent value="humedad" className="mt-4">
                 <Card>
                  <CardHeader><CardTitle>Ensayo: Porcentaje de Humedad</CardTitle></CardHeader>
                  <CardContent className="text-center"><p className="text-muted-foreground p-8">Formulario próximamente.</p></CardContent>
                </Card>
              </TabsContent>

           </Tabs>
        </CardContent>
      </Card>
      
      {/* SECCIÓN DE APROBACIÓN Y OBSERVACIONES */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label>Aprobación</Label>
                  <Select>
                      <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado de la muestra" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="aprobado">Aprobado</SelectItem>
                          <SelectItem value="rechazado">Rechazado</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <Textarea id="observaciones" placeholder="Añada cualquier nota relevante sobre la muestra o los ensayos..." />
              </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Registrar Ensayo de Materia Prima
        </Button>
      </div>
    </form>
  )
}
