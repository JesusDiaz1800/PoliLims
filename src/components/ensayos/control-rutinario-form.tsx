"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilePlus2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { useToast } from "@/hooks/use-toast"

interface Option {
  value: string;
  label: string;
}

interface ControlRutinarioFormProps {
  inspectores: Option[];
}

export function ControlRutinarioForm({ inspectores }: ControlRutinarioFormProps) {
  const { toast } = useToast()
  const [date, setDate] = React.useState<Date>()
  const [fechaEnsayo, setFechaEnsayo] = React.useState<Date>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Registro Guardado",
      description: "El control ha sido registrado exitosamente.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Información de Producción</CardTitle>
            <CardDescription>Datos de trazabilidad de la línea de producción.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
                <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora">Hora</Label>
              <Input id="hora" type="time" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="inspector">Inspector</Label>
                <Select>
                    <SelectTrigger id="inspector">
                        <SelectValue placeholder="Seleccione un inspector" />
                    </SelectTrigger>
                    <SelectContent>
                        {inspectores.map(inspector => (
                          <SelectItem key={inspector.value} value={inspector.value}>{inspector.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="maquinista">Maquinista</Label>
                <Input id="maquinista" placeholder="Nombre del maquinista"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="maquina">Máquina</Label>
                <Input id="maquina" placeholder="Ej: Máquina 1"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="producto">Producto</Label>
                <Input id="producto" placeholder="Ej: Tubería HDPE"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input id="proveedor" placeholder="Nombre del proveedor"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="fecha_ensayo">Fecha de Ensayo</Label>
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaEnsayo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaEnsayo ? format(fechaEnsayo, "PPP") : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaEnsayo}
                      onSelect={setFechaEnsayo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
            </div>
        </CardContent>
      </Card>
      
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Mediciones Dimensionales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="diametro">Diámetro [mm]</Label>
                    <Input id="diametro" type="number" placeholder="Ingrese el diámetro"/>
                </div>
               <div className="space-y-2">
                  <Label htmlFor="espesor_min">Espesor Mín. [mm]</Label>
                  <Input id="espesor_min" type="number" placeholder="Valor mínimo"/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="espesor_max">Espesor Máx. [mm]</Label>
                  <Input id="espesor_max" type="number" placeholder="Valor máximo"/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="largo">Largo [mm]</Label>
                  <Input id="largo" type="number" placeholder="Largo de la muestra"/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="peso_muestra">Peso muestra [g]</Label>
                  <Input id="peso_muestra" type="number" placeholder="Peso en gramos"/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="peso_kg_m">Peso [kg/m]</Label>
                  <Input id="peso_kg_m" type="number" placeholder="Peso en kg/metro"/>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="ovalidad">Ovalidad [mm]</Label>
                  <Input id="ovalidad" type="number" placeholder="Medida de ovalidad"/>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ensayos Mecánicos y Visuales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                   <div className="space-y-2">
                      <Label htmlFor="resistencia_impacto">Resistencia al Impacto</Label>
                      <Input id="resistencia_impacto" placeholder="Resultado del ensayo"/>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="phi_20">PHI a 20[°C]</Label>
                      <Input id="phi_20" placeholder="Resultado del ensayo"/>
                  </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones de Calidad Visual</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Añada cualquier nota sobre la calidad visual, al tacto, color, etc."
                      rows={3}
                    />
                 </div>
            </CardContent>
           </Card>
       </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Registrar Control
        </Button>
      </div>
    </form>
  )
}
