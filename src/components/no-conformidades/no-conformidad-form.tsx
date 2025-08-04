
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useDynamicData, type NoConformidad } from "@/context/data-context";
import { Textarea } from "../ui/textarea";

interface Option {
  value: string;
  label: string;
}

interface NoConformidadFormProps {
  incidenciaToEdit: NoConformidad | null;
  onFormSubmit: () => void;
  analistas: Option[];
  productosAfectados: Option[];
  equiposImplicados: Option[];
}

const formSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(['Interna', 'Reclamo de Cliente', 'Auditoría']),
  fecha_deteccion: z.date({ required_error: "La fecha es requerida." }),
  descripcion: z.string().nonempty("La descripción es requerida."),
  estado: z.enum(['Abierta', 'En Investigación', 'Resuelta', 'Cerrada']),
  severidad: z.enum(['Baja', 'Media', 'Alta', 'Crítica']),
  responsable: z.string().nonempty("El responsable es requerido."),
  fecha_vencimiento: z.date().optional(),
  accion_correctiva: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function NoConformidadForm({ 
    incidenciaToEdit, 
    onFormSubmit, 
    analistas,
    productosAfectados,
    equiposImplicados
}: NoConformidadFormProps) {
  const { toast } = useToast();
  const { addIncidencia, updateIncidencia, addRecentActivity } = useDynamicData();
  const isEditing = !!incidenciaToEdit;

  const defaultValues = React.useMemo(() => ({
      id: incidenciaToEdit?.id || undefined,
      tipo: incidenciaToEdit?.tipo || 'Interna',
      fecha_deteccion: incidenciaToEdit?.fecha_deteccion ? parseISO(incidenciaToEdit.fecha_deteccion) : new Date(),
      descripcion: incidenciaToEdit?.descripcion || "",
      estado: incidenciaToEdit?.estado || 'Abierta',
      severidad: incidenciaToEdit?.severidad || 'Media',
      responsable: incidenciaToEdit?.responsable || "",
      fecha_vencimiento: incidenciaToEdit?.fecha_vencimiento ? parseISO(incidenciaToEdit.fecha_vencimiento) : undefined,
      accion_correctiva: incidenciaToEdit?.accion_correctiva || "",
    }), [incidenciaToEdit]);
    
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  React.useEffect(() => {
      form.reset(defaultValues);
  }, [incidenciaToEdit, defaultValues, form]);

  const onSubmit = async (data: FormValues) => {
    const incidenciaData = {
      ...data,
      fecha_deteccion: format(data.fecha_deteccion, "yyyy-MM-dd"),
      fecha_vencimiento: data.fecha_vencimiento ? format(data.fecha_vencimiento, "yyyy-MM-dd") : undefined,
    };

    try {
      if (isEditing && incidenciaToEdit) {
        await updateIncidencia(incidenciaToEdit.id, incidenciaData);
        await addRecentActivity({
          user: data.responsable,
          action: `actualizó la no conformidad ${incidenciaToEdit.id}`,
        });
        toast({
          title: "Incidencia Actualizada",
          description: `La incidencia ${incidenciaToEdit.id} ha sido actualizada.`,
        });
      } else {
        const { id, ...newIncidenciaData } = incidenciaData;
        await addIncidencia(newIncidenciaData);
        await addRecentActivity({
          user: data.responsable,
          action: `registró una nueva no conformidad de tipo '${data.tipo}'`,
        });
        toast({
          title: "Incidencia Registrada",
          description: "La nueva no conformidad ha sido registrada.",
        });
      }
      onFormSubmit();
    } catch (error) {
      console.error("Error guardando la incidencia:", error);
      toast({
        variant: "destructive",
        title: "Error al Guardar",
        description: "No se pudo guardar la incidencia. Por favor, intente de nuevo.",
      });
    }
  };

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="tipo" render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Incidencia</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Interna">Interna</SelectItem>
                <SelectItem value="Reclamo de Cliente">Reclamo de Cliente</SelectItem>
                <SelectItem value="Auditoría">Auditoría</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )}/>
        <FormField control={form.control} name="fecha_deteccion" render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Detección</FormLabel>
            <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent>
            </Popover><FormMessage />
          </FormItem>
        )}/>
        <FormField control={form.control} name="descripcion" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Descripción Detallada</FormLabel>
            <FormControl><Textarea placeholder="Describa la no conformidad, incluyendo detalles, lotes, equipos, etc." {...field} rows={4}/></FormControl><FormMessage />
          </FormItem>
        )}/>
          <FormField control={form.control} name="severidad" render={({ field }) => (
          <FormItem>
            <FormLabel>Severidad</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )}/>
          <FormField control={form.control} name="estado" render={({ field }) => (
          <FormItem>
            <FormLabel>Estado</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Abierta">Abierta</SelectItem>
                <SelectItem value="En Investigación">En Investigación</SelectItem>
                <SelectItem value="Resuelta">Resuelta</SelectItem>
                <SelectItem value="Cerrada">Cerrada</SelectItem>
              </SelectContent>
            </Select><FormMessage />
          </FormItem>
        )}/>
        <FormField control={form.control} name="responsable" render={({ field }) => (
          <FormItem>
            <FormLabel>Responsable</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Asignar a..."/></SelectTrigger></FormControl>
              <SelectContent>
                {analistas.map(a => <SelectItem key={a.value} value={a.label}>{a.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}/>
        <FormField control={form.control} name="fecha_vencimiento" render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Vencimiento</FormLabel>
            <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full justify-start text-left font-normal",!field.value && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccione fecha</span>}</Button></FormControl></PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent>
            </Popover><FormMessage />
          </FormItem>
        )}/>
        <FormField control={form.control} name="accion_correctiva" render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Acción Correctiva / Preventiva</FormLabel>
            <FormControl><Textarea placeholder="Describa la acción tomada para resolver la incidencia." {...field} rows={4}/></FormControl><FormMessage />
          </FormItem>
        )}/>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Guardar Cambios' : 'Registrar Incidencia'}
        </Button>
      </div>
    </Form>
  );
}
