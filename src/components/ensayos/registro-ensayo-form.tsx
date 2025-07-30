"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilePlus2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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

export function RegistroEnsayoForm() {
  const { toast } = useToast()
  const [date, setDate] = React.useState<Date>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí iría la lógica de envío del formulario
    console.log("Formulario enviado");
    toast({
      title: "Ensayo Registrado",
      description: "El nuevo ensayo ha sido registrado exitosamente en el sistema.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="identificacion_muestra">Identificación de Muestra</Label>
          <Input id="identificacion_muestra" placeholder="Ej: HDPE-0821-A" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo_ensayo">Tipo de Ensayo</Label>
          <Select>
            <SelectTrigger id="tipo_ensayo">
              <SelectValue placeholder="Seleccione un tipo de ensayo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="traccion">Ensayo de Tracción</SelectItem>
              <SelectItem value="impacto">Ensayo de Impacto (Izod/Charpy)</SelectItem>
              <SelectItem value="dureza">Medición de Dureza (Shore A/D)</SelectItem>
              <SelectItem value="mfi">Índice de Fluidez (MFI)</SelectItem>
              <SelectItem value="dsc">Calorimetría Diferencial de Barrido (DSC)</SelectItem>
              <SelectItem value="ftir">Espectroscopía Infrarroja (FTIR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <Label htmlFor="analista_asignado">Analista Asignado</Label>
            <Select>
                <SelectTrigger id="analista_asignado">
                    <SelectValue placeholder="Seleccione un analista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="jdiaz">Jesus Diaz</SelectItem>
                    <SelectItem value="mmaximiliano">Maximiliano M.</SelectItem>
                    <SelectItem value="afigueroa">Antonia Figueroa</SelectItem>
                    <SelectItem value="vlutz">Victor Lutz</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="prioridad">Prioridad</Label>
        <Select defaultValue="normal">
          <SelectTrigger id="prioridad">
            <SelectValue placeholder="Seleccione la prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones Adicionales</Label>
        <Textarea
          id="observaciones"
          placeholder="Añada cualquier nota o detalle relevante sobre el ensayo..."
          rows={4}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Registrar Ensayo
        </Button>
      </div>
    </form>
  )
}
